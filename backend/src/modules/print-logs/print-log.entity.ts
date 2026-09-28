/**
 * @file Entidad de `print_logs` (auditoría de impresiones, solo inserción).
 */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { JsonObject } from '../../common/types/json.types.js';

/** Estados de un registro de impresión. */
export const PRINT_STATUS = ['SUCCESS', 'TEST'] as const;
export type PrintStatus = (typeof PRINT_STATUS)[number];

@Entity({ name: 'print_logs' })
export class PrintLogEntity {
  /** BIGSERIAL: el driver `pg` lo devuelve como string. */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'invoice_id', type: 'varchar', length: 100 })
  invoiceId: string;

  @Column({ name: 'invoice_type', type: 'varchar', length: 20, nullable: true })
  invoiceType: string | null;

  @Column({ name: 'template_id', type: 'varchar', length: 100 })
  templateId: string;

  @Column({ name: 'template_version', type: 'int', nullable: true })
  templateVersion: number | null;

  @Column({ name: 'printed_by', type: 'varchar', length: 150 })
  printedBy: string;

  @Column({ type: 'smallint' })
  copies: number;

  @Column({ type: 'varchar', length: 10 })
  status: PrintStatus;

  /** Datos de la factura tal como se imprimieron (opcional, trazabilidad). */
  @Column({ name: 'invoice_snapshot', type: 'jsonb', nullable: true })
  invoiceSnapshot: JsonObject | null;

  @Column({ name: 'printed_at', type: 'timestamptz', insert: false, update: false })
  printedAt: Date;
}
