/**
 * @file Parámetros de consulta comunes de los listados de auditoría.
 *
 *   ?period=week&search=serie&limit=200
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { AUDIT_PERIODS, type AuditPeriod } from '../../domain/audit-period.js';

export class AuditQueryDto {
  @ApiPropertyOptional({ enum: AUDIT_PERIODS, default: 'all', description: 'Periodo de calendario' })
  @IsOptional()
  @IsIn(AUDIT_PERIODS)
  period: AuditPeriod = 'all';

  @ApiPropertyOptional({ description: 'Texto a buscar (factura, plantilla o usuario)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ default: 500, minimum: 1, maximum: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit: number = 500;
}
