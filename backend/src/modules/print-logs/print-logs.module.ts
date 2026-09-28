/**
 * @file Módulo de auditoría de impresiones.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintLogEntity } from './print-log.entity.js';
import { PrintLogsService } from './print-logs.service.js';
import { PrintLogsController } from './print-logs.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PrintLogEntity])],
  controllers: [PrintLogsController],
  providers: [PrintLogsService],
})
export class PrintLogsModule {}
