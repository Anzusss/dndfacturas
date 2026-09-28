/**
 * @file Casos de uso de plantillas: consultar, guardar borradores, enviar a
 * revisión, aprobar, rechazar, exportar e importar.
 *
 * Cada acción que modifica datos se ejecuta en UNA transacción junto con su
 * entrada de historial: o se guardan las dos cosas, o ninguna.
 *
 * Las reglas del ciclo de vida se validan aquí para dar errores claros, y
 * la base de datos las vuelve a comprobar con triggers.
 */

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import type { AuthUser } from '../../common/auth/auth.types.js';
import {
  HISTORY_ACTIONS,
  TEMPLATE_STATUS,
  TEMPLATE_STATUS_LABELS,
  getTransitionError,
  type TemplateStatus,
} from '../../domain/template-lifecycle.js';
import {
  EXPORT_FORMAT,
  TEMPLATE_SCHEMA_VERSION,
  parseImportPayload,
  validateElements,
} from '../../domain/template-validation.js';
import { InvoiceTypeEntity } from '../invoice-types/invoice-type.entity.js';
import { TemplateHistoryService } from '../template-history/template-history.service.js';
import { InvoiceTemplateEntity } from './invoice-template.entity.js';
import { toTemplateResponse, type TemplateResponse } from './template.mapper.js';
import type { SaveTemplateDraftDto } from './dto/template.dto.js';

/** Identidad de una versión. */
interface TemplateKey {
  templateId: string;
  version: number;
}

/** Tipo de factura por defecto si un archivo importado no lo indica. */
const DEFAULT_INVOICE_TYPE = 'CREDITO';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(InvoiceTemplateEntity)
    private readonly repository: Repository<InvoiceTemplateEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly historyService: TemplateHistoryService,
  ) {}

  // ───────────── Consultas ─────────────

  /**
   * Todas las versiones de todas las plantillas, o solo la última de cada una.
   * @param latestOnly `true` → solo la última versión de cada plantilla.
   */
  async findAll(latestOnly = false): Promise<TemplateResponse[]> {
    const qb = this.repository.createQueryBuilder('t');
    if (latestOnly) {
      // DISTINCT ON: la primera fila por template_id según el orden (versión más alta).
      qb.distinctOn(['t.template_id']).orderBy('t.template_id').addOrderBy('t.version', 'DESC');
    } else {
      qb.orderBy('t.created_at', 'ASC').addOrderBy('t.version', 'ASC');
    }
    const rows = await qb.getMany();
    return rows.map(toTemplateResponse);
  }

  /** Una versión concreta. @throws NotFoundException */
  async findOne(key: TemplateKey): Promise<TemplateResponse> {
    return toTemplateResponse(await this.getOrThrow(this.repository, key));
  }

  /** Número de la próxima versión de una plantilla (1 si aún no existe). */
  async getNextVersionNumber(templateId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('t')
      .select('COALESCE(MAX(t.version), 0) + 1', 'next')
      .where('t.template_id = :templateId', { templateId })
      .getRawOne<{ next: number }>();
    return Number(result?.next ?? 1);
  }

  // ───────────── Borradores ─────────────

  /**
   * Crea o actualiza un borrador. Si la versión existe y ya no es borrador,
   * responde 409: hay que crear una versión nueva.
   */
  async saveDraft(key: TemplateKey, dto: SaveTemplateDraftDto, user: AuthUser): Promise<TemplateResponse> {
    const elementErrors = validateElements(dto.elements);
    if (elementErrors.length > 0) throw new BadRequestException(elementErrors);

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InvoiceTemplateEntity);
      await this.assertInvoiceType(manager, dto.invoiceType);

      const existing = await repo.findOneBy(key);
      if (existing && existing.status !== TEMPLATE_STATUS.DRAFT) {
        throw new ConflictException(
          `La versión ${key.version} está "${TEMPLATE_STATUS_LABELS[existing.status]}" y no se puede modificar. Crea una nueva versión.`,
        );
      }

      const content = {
        name: dto.name,
        invoiceType: dto.invoiceType,
        pageSetup: dto.pageSetup,
        elements: dto.elements,
        schemaVersion: dto.schemaVersion ?? TEMPLATE_SCHEMA_VERSION,
        updatedBy: user.email,
      };

      if (existing) {
        await repo.update(key, content);
      } else {
        await repo.insert({ ...key, ...content, status: TEMPLATE_STATUS.DRAFT, createdBy: user.email });
      }

      const saved = await this.getOrThrow(repo, key);
      const action = existing
        ? HISTORY_ACTIONS.SAVED
        : key.version > 1
          ? HISTORY_ACTIONS.NEW_VERSION
          : HISTORY_ACTIONS.CREATED;
      await this.historyService.record({ template: saved, action, user: user.email }, manager);

      return toTemplateResponse(saved);
    });
  }

  /** Elimina un borrador (las versiones enviadas o aprobadas no se borran). */
  async deleteDraft(key: TemplateKey): Promise<void> {
    const existing = await this.getOrThrow(this.repository, key);
    if (existing.status !== TEMPLATE_STATUS.DRAFT) {
      throw new ConflictException('Solo se pueden eliminar borradores.');
    }
    await this.repository.delete(key);
  }

  // ───────────── Ciclo de vida ─────────────

  /** BORRADOR → EN_REVISION. */
  submitForReview(key: TemplateKey, user: AuthUser): Promise<TemplateResponse> {
    return this.transition(key, TEMPLATE_STATUS.IN_REVIEW, user, HISTORY_ACTIONS.SUBMITTED, {
      reviewComment: null,
    });
  }

  /** EN_REVISION → APROBADA (registra quién y cuándo aprueba). */
  approve(key: TemplateKey, user: AuthUser): Promise<TemplateResponse> {
    return this.transition(key, TEMPLATE_STATUS.APPROVED, user, HISTORY_ACTIONS.APPROVED, {
      approvedBy: user.email,
      approvedAt: new Date(),
      reviewComment: null,
    });
  }

  /** EN_REVISION → BORRADOR con el motivo del rechazo. */
  reject(key: TemplateKey, user: AuthUser, comment?: string): Promise<TemplateResponse> {
    return this.transition(
      key,
      TEMPLATE_STATUS.DRAFT,
      user,
      HISTORY_ACTIONS.REJECTED,
      { reviewComment: comment?.trim() || null },
      comment,
    );
  }

  // ───────────── Importar / exportar ─────────────

  /** Contenido del archivo de exportación (y lo registra en el historial). */
  async exportTemplate(key: TemplateKey, user: AuthUser) {
    const template = await this.getOrThrow(this.repository, key);
    await this.historyService.record({ template, action: HISTORY_ACTIONS.EXPORTED, user: user.email });

    return {
      format: EXPORT_FORMAT,
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      template: toTemplateResponse(template),
    };
  }

  /**
   * Importa una plantilla como BORRADOR versión 1. Si el id ya existe se
   * importa como copia con id nuevo (nunca sobrescribe nada).
   */
  async importTemplate(payload: unknown, user: AuthUser): Promise<TemplateResponse> {
    let imported;
    try {
      imported = parseImportPayload(payload);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InvoiceTemplateEntity);
      const invoiceType = imported.invoiceType ?? DEFAULT_INVOICE_TYPE;
      await this.assertInvoiceType(manager, invoiceType);

      const requestedId = typeof imported.templateId === 'string' ? imported.templateId.slice(0, 100) : '';
      const idTaken = !requestedId || (await repo.existsBy({ templateId: requestedId }));
      const baseName = (imported.name || 'Plantilla').slice(0, 180);

      const key = { templateId: idTaken ? `plantilla-${Date.now()}` : requestedId, version: 1 };
      await repo.insert({
        ...key,
        name: idTaken ? `${baseName} (importada)` : baseName,
        invoiceType,
        status: TEMPLATE_STATUS.DRAFT,
        schemaVersion: TEMPLATE_SCHEMA_VERSION,
        pageSetup: imported.pageSetup,
        elements: imported.elements,
        createdBy: user.email,
        updatedBy: user.email,
      });

      const saved = await this.getOrThrow(repo, key);
      await this.historyService.record({ template: saved, action: HISTORY_ACTIONS.IMPORTED, user: user.email }, manager);
      return toTemplateResponse(saved);
    });
  }

  // ───────────── Utilidades internas ─────────────

  /**
   * Cambia el estado de una versión validando la transición y registrando
   * la acción en el historial, todo en una transacción.
   */
  private transition(
    key: TemplateKey,
    to: TemplateStatus,
    user: AuthUser,
    action: (typeof HISTORY_ACTIONS)[keyof typeof HISTORY_ACTIONS],
    extra: Partial<InvoiceTemplateEntity>,
    comment?: string,
  ): Promise<TemplateResponse> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(InvoiceTemplateEntity);
      const current = await this.getOrThrow(repo, key);

      const error = getTransitionError(current.status, to);
      if (error) throw new ConflictException(error);

      await repo.update(key, { status: to, updatedBy: user.email, ...extra });
      const updated = await this.getOrThrow(repo, key);
      await this.historyService.record({ template: updated, action, user: user.email, comment }, manager);
      return toTemplateResponse(updated);
    });
  }

  /** Busca una versión o lanza 404. */
  private async getOrThrow(repo: Repository<InvoiceTemplateEntity>, key: TemplateKey): Promise<InvoiceTemplateEntity> {
    const found = await repo.findOneBy(key);
    if (!found) throw new NotFoundException(`No existe la versión ${key.version} de la plantilla "${key.templateId}".`);
    return found;
  }

  /** Comprueba que el tipo de factura existe (400 si no). */
  private async assertInvoiceType(manager: EntityManager, code: string): Promise<void> {
    if (!(await manager.getRepository(InvoiceTypeEntity).existsBy({ code }))) {
      throw new BadRequestException(`Tipo de factura desconocido: "${code}".`);
    }
  }
}
