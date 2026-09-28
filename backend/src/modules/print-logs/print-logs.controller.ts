/**
 * @file Endpoints de auditoría de impresiones.
 *
 *   GET  /api/print-logs?period=month&search=serie
 *   GET  /api/print-logs/count?invoiceId=SERIE%20H%200000255
 *   POST /api/print-logs
 */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequirePermission } from '../../common/auth/auth.decorators.js';
import type { AuthUser } from '../../common/auth/auth.types.js';
import { AuditQueryDto } from '../../common/dto/audit-query.dto.js';
import { PERMISSIONS } from '../../domain/permissions.js';
import { CreatePrintLogDto } from './dto/create-print-log.dto.js';
import { PrintLogsService } from './print-logs.service.js';

@ApiTags('Auditoría')
@Controller('print-logs')
export class PrintLogsController {
  constructor(private readonly printLogsService: PrintLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Historial de impresiones (más reciente primero)' })
  findAll(@Query() query: AuditQueryDto) {
    return this.printLogsService.findAll(query);
  }

  @Get('count')
  @ApiOperation({ summary: 'Veces que se imprimió una factura (para detectar reimpresiones)' })
  @ApiQuery({ name: 'invoiceId', required: true })
  async count(@Query('invoiceId') invoiceId: string) {
    return { invoiceId, count: await this.printLogsService.countPrints(invoiceId ?? '') };
  }

  @Post()
  @RequirePermission(PERMISSIONS.PRINT_INVOICES)
  @ApiOperation({ summary: 'Registra una impresión' })
  create(@Body() dto: CreatePrintLogDto, @CurrentUser() user: AuthUser) {
    return this.printLogsService.create(dto, user);
  }
}
