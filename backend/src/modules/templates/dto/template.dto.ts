/**
 * @file DTOs (datos de entrada validados) del módulo de plantillas.
 *
 * El ValidationPipe global elimina cualquier campo no declarado aquí
 * (`whitelist`), así el cliente no puede forzar, p. ej., `status` o
 * `approvedBy` al guardar un borrador.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsObject, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import type { JsonObject } from '../../../common/types/json.types.js';

/** Contenido de un borrador (lo que el editor permite cambiar). */
export class SaveTemplateDraftDto {
  @ApiProperty({ example: 'Factura Crédito Media Carta' })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({ example: 'CREDITO' })
  @IsString()
  @Length(1, 20)
  invoiceType: string;

  @ApiProperty({ description: 'Tamaño de hoja, márgenes y fuente', example: { size: 'HALF_LETTER', orientation: 'landscape' } })
  @IsObject()
  pageSetup: JsonObject;

  @ApiProperty({ description: 'Bloques del lienzo', type: 'array', items: { type: 'object' } })
  @IsArray()
  elements: JsonObject[];

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  schemaVersion?: number;
}

/** Rechazo de una versión en revisión. */
export class RejectTemplateDto {
  @ApiPropertyOptional({ description: 'Motivo (lo verá el diseñador)', example: 'Los márgenes no coinciden con el membrete' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
