/**
 * @file Endpoints del historial de cambios de plantillas.
 *
 *   GET /api/template-history?period=week&search=credito
 */

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditQueryDto } from '../../common/dto/audit-query.dto.js';
import { TemplateHistoryService } from './template-history.service.js';

@ApiTags('Auditoría')
@Controller('template-history')
export class TemplateHistoryController {
  constructor(private readonly historyService: TemplateHistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Historial de cambios de plantillas (más reciente primero)' })
  findAll(@Query() query: AuditQueryDto) {
    return this.historyService.findAll(query);
  }
}
