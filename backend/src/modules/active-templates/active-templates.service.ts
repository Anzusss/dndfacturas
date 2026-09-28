/**
 * @file Plantilla activa por tipo de factura: consultar y activar.
 */

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type { AuthUser } from '../../common/auth/auth.types.js';
import { HISTORY_ACTIONS, TEMPLATE_STATUS } from '../../domain/template-lifecycle.js';
import { InvoiceTypeEntity } from '../invoice-types/invoice-type.entity.js';
import { InvoiceTemplateEntity } from '../templates/invoice-template.entity.js';
import { toTemplateResponse, type TemplateResponse } from '../templates/template.mapper.js';
import { TemplateHistoryService } from '../template-history/template-history.service.js';
import { ActiveTemplateEntity } from './active-template.entity.js';

/** Referencia a una versión, en el formato del frontend. */
export interface ActiveTemplateRef {
  templateId: string;
  version: number;
  activatedBy: string;
  activatedAt: Date;
}

@Injectable()
export class ActiveTemplatesService {
  constructor(
    @InjectRepository(ActiveTemplateEntity)
    private readonly repository: Repository<ActiveTemplateEntity>,
    @InjectRepository(InvoiceTemplateEntity)
    private readonly templates: Repository<InvoiceTemplateEntity>,
    @InjectRepository(InvoiceTypeEntity)
    private readonly invoiceTypes: Repository<InvoiceTypeEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly historyService: TemplateHistoryService,
  ) {}

  /**
   * Mapa tipo → versión activa (`null` si el tipo no tiene ninguna).
   * Es el mismo formato que usa el frontend: { CREDITO: {...}, CONTADO: null }.
   */
  async getActiveMap(): Promise<Record<string, ActiveTemplateRef | null>> {
    const [types, actives] = await Promise.all([this.invoiceTypes.find(), this.repository.find()]);
    return Object.fromEntries(
      types.map((type) => {
        const active = actives.find((a) => a.invoiceType === type.code);
        return [
          type.code,
          active
            ? {
                templateId: active.templateId,
                version: active.templateVersion,
                activatedBy: active.activatedBy,
                activatedAt: active.activatedAt,
              }
            : null,
        ];
      }),
    );
  }

  /**
   * Plantilla completa que se usa para imprimir un tipo de factura.
   * @throws NotFoundException si el tipo no tiene plantilla activa.
   */
  async getActiveTemplate(invoiceType: string): Promise<TemplateResponse> {
    const active = await this.repository.findOneBy({ invoiceType });
    if (!active) throw new NotFoundException(`No hay plantilla activa para facturas de tipo "${invoiceType}".`);

    const template = await this.templates.findOneByOrFail({
      templateId: active.templateId,
      version: active.templateVersion,
    });
    return toTemplateResponse(template);
  }

  /**
   * Activa una versión APROBADA para su tipo de factura (en una transacción
   * junto con su entrada de historial).
   */
  activate(invoiceType: string, templateId: string, version: number, user: AuthUser): Promise<ActiveTemplateRef> {
    return this.dataSource.transaction(async (manager) => {
      const template = await manager.getRepository(InvoiceTemplateEntity).findOneBy({ templateId, version });
      if (!template) throw new NotFoundException(`No existe la versión ${version} de "${templateId}".`);
      if (template.status !== TEMPLATE_STATUS.APPROVED) {
        throw new ConflictException('Solo se pueden activar plantillas aprobadas.');
      }
      if (template.invoiceType !== invoiceType) {
        throw new ConflictException(`La plantilla es de tipo ${template.invoiceType} y no puede activarse para ${invoiceType}.`);
      }

      const repo = manager.getRepository(ActiveTemplateEntity);
      await repo.upsert(
        { invoiceType, templateId, templateVersion: version, activatedBy: user.email },
        ['invoiceType'],
      );

      const typeLabel = (await manager.getRepository(InvoiceTypeEntity).findOneBy({ code: invoiceType }))?.label;
      await this.historyService.record(
        {
          template,
          action: HISTORY_ACTIONS.ACTIVATED,
          user: user.email,
          comment: `Activa para facturas de ${typeLabel ?? invoiceType}`,
        },
        manager,
      );

      const saved = await repo.findOneByOrFail({ invoiceType });
      return {
        templateId: saved.templateId,
        version: saved.templateVersion,
        activatedBy: saved.activatedBy,
        activatedAt: saved.activatedAt,
      };
    });
  }
}
