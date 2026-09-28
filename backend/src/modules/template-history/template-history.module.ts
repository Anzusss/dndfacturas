/**
 * @file Módulo del historial de cambios de plantillas.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateHistoryEntity } from './template-history.entity.js';
import { TemplateHistoryService } from './template-history.service.js';
import { TemplateHistoryController } from './template-history.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateHistoryEntity])],
  controllers: [TemplateHistoryController],
  providers: [TemplateHistoryService],
  exports: [TemplateHistoryService],
})
export class TemplateHistoryModule {}
