/**
 * @file Auditoría de impresiones: registrar, listar y contar reimpresiones.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import type { AuthUser } from '../../common/auth/auth.types.js';
import type { AuditQueryDto } from '../../common/dto/audit-query.dto.js';
import { getPeriodStart } from '../../domain/audit-period.js';
import { PrintLogEntity } from './print-log.entity.js';
import type { CreatePrintLogDto } from './dto/create-print-log.dto.js';

/** Formato de respuesta (el mismo que usa el frontend). */
export interface PrintLogResponse {
  id: string;
  invoiceId: string;
  invoiceType: string | null;
  templateId: string;
  templateVersion: number | null;
  printedAt: Date;
  user: string;
  copies: number;
  status: string;
}

/** Entidad → respuesta (sin el snapshot, que puede ser grande). */
const toResponse = (row: PrintLogEntity): PrintLogResponse => ({
  id: row.id,
  invoiceId: row.invoiceId,
  invoiceType: row.invoiceType,
  templateId: row.templateId,
  templateVersion: row.templateVersion,
  printedAt: row.printedAt,
  user: row.printedBy,
  copies: row.copies,
  status: row.status,
});

@Injectable()
export class PrintLogsService {
  constructor(
    @InjectRepository(PrintLogEntity)
    private readonly repository: Repository<PrintLogEntity>,
  ) {}

  /** Registra una impresión a nombre del usuario de la sesión. */
  async create(dto: CreatePrintLogDto, user: AuthUser): Promise<PrintLogResponse> {
    const result = await this.repository.insert({
      invoiceId: dto.invoiceId,
      invoiceType: dto.invoiceType ?? null,
      templateId: dto.templateId,
      templateVersion: dto.templateVersion ?? null,
      printedBy: user.email,
      copies: dto.copies ?? 1,
      status: dto.status ?? 'SUCCESS',
      invoiceSnapshot: dto.invoiceSnapshot ?? null,
    });
    const id = String(result.identifiers[0].id);
    return toResponse(await this.repository.findOneByOrFail({ id }));
  }

  /** Impresiones filtradas por periodo y texto, más reciente primero. */
  async findAll(query: AuditQueryDto): Promise<PrintLogResponse[]> {
    const qb = this.repository.createQueryBuilder('p').orderBy('p.printed_at', 'DESC').limit(query.limit);

    const periodStart = getPeriodStart(query.period);
    if (periodStart) qb.andWhere('p.printed_at >= :periodStart', { periodStart });

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      qb.andWhere(
        new Brackets((w) => {
          w.where('p.invoice_id ILIKE :term', { term }).orWhere('p.printed_by ILIKE :term', { term });
        }),
      );
    }

    return (await qb.getMany()).map(toResponse);
  }

  /** Veces que se imprimió de verdad una factura (sin contar pruebas). */
  countPrints(invoiceId: string): Promise<number> {
    return this.repository.countBy({ invoiceId, status: 'SUCCESS' });
  }
}
