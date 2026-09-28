/**
 * @file Entidad de `template_history` (historial de cambios, solo inserción).
 */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { HistoryAction } from '../../domain/template-lifecycle.js';

@Entity({ name: 'template_history' })
export class TemplateHistoryEntity {
  /** BIGSERIAL: el driver `pg` lo devuelve como string para no perder precisión. */
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'template_id', type: 'varchar', length: 100 })
  templateId: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ name: 'template_name', type: 'varchar', length: 200 })
  templateName: string;

  @Column({ name: 'invoice_type', type: 'varchar', length: 20, nullable: true })
  invoiceType: string | null;

  @Column({ type: 'varchar', length: 30 })
  action: HistoryAction;

  @Column({ name: 'user_email', type: 'varchar', length: 150 })
  userEmail: string;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ name: 'created_at', type: 'timestamptz', insert: false, update: false })
  createdAt: Date;
}
