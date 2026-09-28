/**
 * @file Endpoint de facturas (proxy a Dynamics).
 *
 *   GET /api/invoices/:invoiceNumber   (el número va codificado: SERIE%20H%200000255)
 *
 * Exige permiso de impresión porque devuelve datos de clientes.
 */

import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermission } from '../../common/auth/auth.decorators.js';
import { PERMISSIONS } from '../../domain/permissions.js';
import { InvoicesService } from './invoices.service.js';

@ApiTags('Facturas (Dynamics)')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(':invoiceNumber')
  @RequirePermission(PERMISSIONS.PRINT_INVOICES)
  @ApiOperation({ summary: 'JSON de una factura tal como lo devuelve Dynamics' })
  getInvoice(@Param('invoiceNumber') invoiceNumber: string) {
    return this.invoicesService.getRawInvoice(invoiceNumber);
  }
}
