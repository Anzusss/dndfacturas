/**
 * @file Datos para activar una versión aprobada.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class ActivateTemplateDto {
  @ApiProperty({ example: 'factura-fiscal-real-v1' })
  @IsString()
  @Length(1, 100)
  templateId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  version: number;
}
