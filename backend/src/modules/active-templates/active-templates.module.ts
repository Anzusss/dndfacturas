/**
 * @file Módulo de plantilla activa por tipo de factura.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTypeEntity } from '../invoice-types/invoice-type.entity.js';
import { InvoiceTemplateEntity } from '../templates/invoice-template.entity.js';
import { TemplateHistoryModule } from '../template-history/template-history.module.js';
import { ActiveTemplateEntity } from './active-template.entity.js';
import { ActiveTemplatesService } from './active-templates.service.js';
import { ActiveTemplatesController } from './active-templates.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveTemplateEntity, InvoiceTemplateEntity, InvoiceTypeEntity]),
    TemplateHistoryModule,
  ],
  controllers: [ActiveTemplatesController],
  providers: [ActiveTemplatesService],
  exports: [ActiveTemplatesService],
})
export class ActiveTemplatesModule {}
