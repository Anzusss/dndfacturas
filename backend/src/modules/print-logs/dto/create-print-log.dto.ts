/**
 * @file Datos de un evento de impresión. El usuario NO viene en el cuerpo:
 * se toma de la sesión (cabeceras simuladas hoy), para que nadie pueda
 * registrar impresiones a nombre de otro.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsObject, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { PRINT_STATUS, type PrintStatus } from '../print-log.entity.js';
import type { JsonObject } from '../../../common/types/json.types.js';

export class CreatePrintLogDto {
  @ApiProperty({ example: 'SERIE H 0000255' })
  @IsString()
  @Length(1, 100)
  invoiceId: string;

  @ApiPropertyOptional({ example: 'CREDITO' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  invoiceType?: string;

  @ApiProperty({ example: 'factura-fiscal-real-v1' })
  @IsString()
  @Length(1, 100)
  templateId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  templateVersion?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  copies?: number;

  @ApiPropertyOptional({ enum: PRINT_STATUS, default: 'SUCCESS' })
  @IsOptional()
  @IsIn(PRINT_STATUS)
  status?: PrintStatus;

  @ApiPropertyOptional({ description: 'Datos de la factura impresa (InvoiceData)' })
  @IsOptional()
  @IsObject()
  invoiceSnapshot?: JsonObject;
}
