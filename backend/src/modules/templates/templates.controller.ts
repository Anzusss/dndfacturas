/**
 * @file Endpoints de plantillas.
 *
 *   GET    /api/templates?latest=true
 *   GET    /api/templates/:templateId/next-version
 *   GET    /api/templates/:templateId/versions/:version
 *   PUT    /api/templates/:templateId/versions/:version          (guardar borrador)
 *   DELETE /api/templates/:templateId/versions/:version          (eliminar borrador)
 *   POST   /api/templates/:templateId/versions/:version/submit
 *   POST   /api/templates/:templateId/versions/:version/approve
 *   POST   /api/templates/:templateId/versions/:version/reject
 *   POST   /api/templates/:templateId/versions/:version/export
 *   POST   /api/templates/import
 *
 * Los endpoints de escritura exigen permiso (ver @RequirePermission).
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequirePermission } from '../../common/auth/auth.decorators.js';
import type { AuthUser } from '../../common/auth/auth.types.js';
import { PERMISSIONS } from '../../domain/permissions.js';
import { RejectTemplateDto, SaveTemplateDraftDto } from './dto/template.dto.js';
import { TemplatesService } from './templates.service.js';

@ApiTags('Plantillas')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista las plantillas (todas las versiones o solo la última de cada una)' })
  @ApiQuery({ name: 'latest', required: false, type: Boolean })
  findAll(@Query('latest', new ParseBoolPipe({ optional: true })) latest?: boolean) {
    return this.templatesService.findAll(latest ?? false);
  }

  @Get(':templateId/next-version')
  @ApiOperation({ summary: 'Número de la próxima versión de una plantilla' })
  async nextVersion(@Param('templateId') templateId: string) {
    return { nextVersion: await this.templatesService.getNextVersionNumber(templateId) };
  }

  @Get(':templateId/versions/:version')
  @ApiOperation({ summary: 'Obtiene una versión concreta' })
  findOne(@Param('templateId') templateId: string, @Param('version', ParseIntPipe) version: number) {
    return this.templatesService.findOne({ templateId, version });
  }

  @Put(':templateId/versions/:version')
  @RequirePermission(PERMISSIONS.EDIT_TEMPLATES)
  @ApiOperation({ summary: 'Crea o actualiza un BORRADOR' })
  saveDraft(
    @Param('templateId') templateId: string,
    @Param('version', ParseIntPipe) version: number,
    @Body() dto: SaveTemplateDraftDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templatesService.saveDraft({ templateId, version }, dto, user);
  }

  @Delete(':templateId/versions/:version')
  @RequirePermission(PERMISSIONS.EDIT_TEMPLATES)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un borrador' })
  deleteDraft(@Param('templateId') templateId: string, @Param('version', ParseIntPipe) version: number) {
    return this.templatesService.deleteDraft({ templateId, version });
  }

  @Post(':templateId/versions/:version/submit')
  @RequirePermission(PERMISSIONS.EDIT_TEMPLATES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envía un borrador a revisión' })
  submit(
    @Param('templateId') templateId: string,
    @Param('version', ParseIntPipe) version: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templatesService.submitForReview({ templateId, version }, user);
  }

  @Post(':templateId/versions/:version/approve')
  @RequirePermission(PERMISSIONS.REVIEW_TEMPLATES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprueba una versión en revisión (gerente)' })
  approve(
    @Param('templateId') templateId: string,
    @Param('version', ParseIntPipe) version: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templatesService.approve({ templateId, version }, user);
  }

  @Post(':templateId/versions/:version/reject')
  @RequirePermission(PERMISSIONS.REVIEW_TEMPLATES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rechaza una versión en revisión (vuelve a borrador)' })
  reject(
    @Param('templateId') templateId: string,
    @Param('version', ParseIntPipe) version: number,
    @Body() dto: RejectTemplateDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templatesService.reject({ templateId, version }, user, dto.comment);
  }

  @Post(':templateId/versions/:version/export')
  @RequirePermission(PERMISSIONS.TRANSFER_TEMPLATES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Devuelve el archivo de exportación de una versión' })
  exportTemplate(
    @Param('templateId') templateId: string,
    @Param('version', ParseIntPipe) version: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.templatesService.exportTemplate({ templateId, version }, user);
  }

  @Post('import')
  @RequirePermission(PERMISSIONS.TRANSFER_TEMPLATES)
  @ApiOperation({ summary: 'Importa un archivo de plantilla (entra como borrador v1)' })
  @ApiBody({ description: 'Contenido del archivo exportado', schema: { type: 'object' } })
  importTemplate(@Body() payload: Record<string, unknown>, @CurrentUser() user: AuthUser) {
    return this.templatesService.importTemplate(payload, user);
  }
}
