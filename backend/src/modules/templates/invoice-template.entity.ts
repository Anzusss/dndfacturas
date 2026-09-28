/**
 * @file Entidad de `invoice_templates`. Cada fila es UNA VERSIÓN de una
 * plantilla (clave compuesta template_id + version).
 *
 * Las columnas marcadas `insert: false, update: false` las rellena la base de
 * datos (valores por defecto, triggers o columnas calculadas).
 */

import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { TemplateStatus } from '../../domain/template-lifecycle.js';
import type { JsonObject } from '../../common/types/json.types.js';

@Entity({ name: 'invoice_templates' })
export class InvoiceTemplateEntity {
  @PrimaryColumn({ name: 'template_id', type: 'varchar', length: 100 })
  templateId: string;

  @PrimaryColumn({ type: 'int' })
  version: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'invoice_type', type: 'varchar', length: 20 })
  invoiceType: string;

  @Column({ type: 'varchar', length: 20 })
  status: TemplateStatus;

  @Column({ name: 'schema_version', type: 'int' })
  schemaVersion: number;

  /** Tamaño de hoja, márgenes y fuente (mismo JSON que el frontend). */
  @Column({ name: 'page_setup', type: 'jsonb' })
  pageSetup: JsonObject;

  /** Bloques del lienzo (mismo JSON que el frontend). */
  @Column({ type: 'jsonb' })
  elements: JsonObject[];

  /** Columna calculada por PostgreSQL a partir de page_setup.size. */
  @Column({ name: 'paper_size', type: 'varchar', insert: false, update: false })
  paperSize: string;

  @Column({ name: 'paper_orientation', type: 'varchar', insert: false, update: false })
  paperOrientation: string;

  @Column({ name: 'review_comment', type: 'text', nullable: true })
  reviewComment: string | null;

  @Column({ name: 'created_by', type: 'varchar', length: 150 })
  createdBy: string;

  @Column({ name: 'created_at', type: 'timestamptz', insert: false, update: false })
  createdAt: Date;

  @Column({ name: 'updated_by', type: 'varchar', length: 150 })
  updatedBy: string;

  /** Lo actualiza el trigger `set_updated_at`. */
  @Column({ name: 'updated_at', type: 'timestamptz', insert: false, update: false })
  updatedAt: Date;

  @Column({ name: 'approved_by', type: 'varchar', length: 150, nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt: Date | null;
}
