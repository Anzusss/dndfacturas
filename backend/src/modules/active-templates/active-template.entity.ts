/**
 * @file Entidad de `active_templates`: plantilla activa de cada tipo de factura.
 * La clave primaria (invoice_type) garantiza una sola activa por tipo.
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'active_templates' })
export class ActiveTemplateEntity {
  @PrimaryColumn({ name: 'invoice_type', type: 'varchar', length: 20 })
  invoiceType: string;

  @Column({ name: 'template_id', type: 'varchar', length: 100 })
  templateId: string;

  @Column({ name: 'template_version', type: 'int' })
  templateVersion: number;

  @Column({ name: 'activated_by', type: 'varchar', length: 150 })
  activatedBy: string;

  /** Lo fija el trigger `enforce_active_template`. */
  @Column({ name: 'activated_at', type: 'timestamptz', insert: false, update: false })
  activatedAt: Date;
}
