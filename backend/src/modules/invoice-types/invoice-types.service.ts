/**
 * @file Lógica de tipos de factura.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceTypeEntity } from './invoice-type.entity.js';

@Injectable()
export class InvoiceTypesService {
  constructor(
    @InjectRepository(InvoiceTypeEntity)
    private readonly repository: Repository<InvoiceTypeEntity>,
  ) {}

  /** Todos los tipos, ordenados por código. */
  findAll(): Promise<InvoiceTypeEntity[]> {
    return this.repository.find({ order: { code: 'ASC' } });
  }

  /**
   * Comprueba que un tipo existe.
   * @throws NotFoundException si no existe.
   */
  async assertExists(code: string): Promise<void> {
    if (!(await this.repository.existsBy({ code }))) {
      throw new NotFoundException(`Tipo de factura desconocido: "${code}".`);
    }
  }
}
