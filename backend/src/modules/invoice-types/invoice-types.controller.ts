/**
 * @file Endpoints de tipos de factura.
 *
 *   GET /api/invoice-types
 */

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceTypesService } from './invoice-types.service.js';

@ApiTags('Tipos de factura')
@Controller('invoice-types')
export class InvoiceTypesController {
  constructor(private readonly invoiceTypesService: InvoiceTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los tipos de factura y sus códigos en Dynamics' })
  findAll() {
    return this.invoiceTypesService.findAll();
  }
}
