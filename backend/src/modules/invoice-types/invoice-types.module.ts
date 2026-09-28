/**
 * @file Módulo de tipos de factura.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTypeEntity } from './invoice-type.entity.js';
import { InvoiceTypesService } from './invoice-types.service.js';
import { InvoiceTypesController } from './invoice-types.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceTypeEntity])],
  controllers: [InvoiceTypesController],
  providers: [InvoiceTypesService],
  exports: [InvoiceTypesService],
})
export class InvoiceTypesModule {}
