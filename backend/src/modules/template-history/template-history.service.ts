/**
 * @file Historial de cambios de plantillas.
 *
 * `record` recibe opcionalmente un EntityManager para registrar la acción
 * DENTRO de la misma transacción que el cambio: si algo falla, no queda ni el
 * cambio ni su entrada de historial.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { getPeriodStart } from '../../domain/audit-period.js';
import type { HistoryAction } from '../../domain/template-lifecycle.js';
import type { AuditQueryDto } from '../../common/dto/audit-query.dto.js';
import { TemplateHistoryEntity } from './template-history.entity.js';

/** Datos mínimos de la plantilla afectada. */
interface TemplateRef {
  templateId: string;
  version: number;
  name: string;
  invoiceType: string | null;
}

/** Formato de respuesta (el mismo que usa el frontend). */
export interface TemplateHistoryResponse {
  id: string;
  templateId: string;
  templateName: string;
  version: number;
  invoiceType: string | null;
  action: HistoryAction;
  user: string;
  comment: string | null;
  at: Date;
}

@Injectable()
export class TemplateHistoryService {
  constructor(
    @InjectRepository(TemplateHistoryEntity)
    private readonly repository: Repository<TemplateHistoryEntity>,
  ) {}

  /**
   * Registra una acción sobre una plantilla.
   * @param manager EntityManager de la transacción en curso (opcional).
   */
  async record(
    params: { template: TemplateRef; action: HistoryAction; user: string; comment?: string | null },
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager ? manager.getRepository(TemplateHistoryEntity) : this.repository;
    await repository.insert({
      templateId: params.template.templateId,
      version: params.template.version,
      templateName: params.template.name,
      invoiceType: params.template.invoiceType,
      action: params.action,
      userEmail: params.user,
      comment: params.comment ?? null,
    });
  }

  /** Historial filtrado por periodo y texto, más reciente primero. */
  async findAll(query: AuditQueryDto): Promise<TemplateHistoryResponse[]> {
    const qb = this.repository.createQueryBuilder('h').orderBy('h.created_at', 'DESC').limit(query.limit);

    const periodStart = getPeriodStart(query.period);
    if (periodStart) qb.andWhere('h.created_at >= :periodStart', { periodStart });

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      qb.andWhere(
        new Brackets((w) => {
          w.where('h.template_id ILIKE :term', { term })
            .orWhere('h.template_name ILIKE :term', { term })
            .orWhere('h.user_email ILIKE :term', { term });
        }),
      );
    }

    const rows = await qb.getMany();
    return rows.map((row) => ({
      id: row.id,
      templateId: row.templateId,
      templateName: row.templateName,
      version: row.version,
      invoiceType: row.invoiceType,
      action: row.action,
      user: row.userEmail,
      comment: row.comment,
      at: row.createdAt,
    }));
  }
}
