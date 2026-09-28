/**
 * @file Entidad de la tabla `invoice_types` (tipos de factura: Crédito, Contado…).
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'invoice_types' })
export class InvoiceTypeEntity {
  /** Código del tipo, p. ej. 'CREDITO'. */
  @PrimaryColumn({ type: 'varchar', length: 20 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  label: string;

  /** Valores equivalentes en la API de Dynamics. */
  @Column({ name: 'dynamics_aliases', type: 'text', array: true })
  dynamicsAliases: string[];

  @Column({ name: 'created_at', type: 'timestamptz', insert: false, update: false })
  createdAt: Date;
}
