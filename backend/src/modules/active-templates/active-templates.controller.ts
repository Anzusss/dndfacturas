/**
 * @file Endpoints de plantilla activa por tipo de factura.
 *
 *   GET /api/active-templates                        → { CREDITO: {...}, CONTADO: {...} }
 *   GET /api/active-templates/:invoiceType/template  → plantilla completa para imprimir
 *   PUT /api/active-templates/:invoiceType           → activa una versión aprobada (gerente)
 */

import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequirePermission } from '../../common/auth/auth.decorators.js';
import type { AuthUser } from '../../common/auth/auth.types.js';
import { PERMISSIONS } from '../../domain/permissions.js';
import { ActivateTemplateDto } from './dto/activate-template.dto.js';
import { ActiveTemplatesService } from './active-templates.service.js';

@ApiTags('Plantilla activa')
@Controller('active-templates')
export class ActiveTemplatesController {
  constructor(private readonly activeTemplatesService: ActiveTemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Versión activa de cada tipo de factura' })
  getActiveMap() {
    return this.activeTemplatesService.getActiveMap();
  }

  @Get(':invoiceType/template')
  @ApiOperation({ summary: 'Plantilla completa que se usa para imprimir un tipo de factura' })
  getActiveTemplate(@Param('invoiceType') invoiceType: string) {
    return this.activeTemplatesService.getActiveTemplate(invoiceType.toUpperCase());
  }

  @Put(':invoiceType')
  @RequirePermission(PERMISSIONS.ACTIVATE_TEMPLATES)
  @ApiOperation({ summary: 'Activa una versión aprobada para un tipo de factura' })
  activate(
    @Param('invoiceType') invoiceType: string,
    @Body() dto: ActivateTemplateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.activeTemplatesService.activate(invoiceType.toUpperCase(), dto.templateId, dto.version, user);
  }
}
