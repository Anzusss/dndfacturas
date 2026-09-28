/**
 * @file Módulo de plantillas.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateHistoryModule } from '../template-history/template-history.module.js';
import { InvoiceTemplateEntity } from './invoice-template.entity.js';
import { TemplatesService } from './templates.service.js';
import { TemplatesController } from './templates.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceTemplateEntity]), TemplateHistoryModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
