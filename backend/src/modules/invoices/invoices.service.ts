/**
 * @file Proxy hacia la API de facturas de Dynamics.
 *
 * El navegador pide la factura a este backend y este la pide a Dynamics.
 * Ventajas:
 * - El token/clave de Dynamics (DYNAMICS_API_TOKEN) nunca llega al navegador.
 * - Se evitan los problemas de CORS con la API de la empresa.
 * - Un único lugar para añadir caché, reintentos o registro de accesos.
 *
 * Devuelve el JSON TAL CUAL lo entrega Dynamics: la traducción a los campos
 * de la plantilla la sigue haciendo el frontend (dynamicsInvoiceMapper.js).
 */

import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../config/env.validation.js';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Obtiene el JSON de una factura desde Dynamics.
   * @param invoiceNumber Número de factura, p. ej. "SERIE H 0000255".
   */
  async getRawInvoice(invoiceNumber: string): Promise<unknown> {
    const url = this.buildUrl(invoiceNumber);
    const token = this.config.get('DYNAMICS_API_TOKEN', { infer: true });
    const timeoutMs = this.config.get('DYNAMICS_API_TIMEOUT_MS', { infer: true });

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      if ((error as Error).name === 'TimeoutError') {
        throw new GatewayTimeoutException('La API de Dynamics no respondió a tiempo.');
      }
      this.logger.error(`No se pudo conectar con Dynamics (${url}): ${(error as Error).message}`);
      throw new BadGatewayException('No se pudo conectar con la API de Dynamics.');
    }

    if (response.status === 404) throw new NotFoundException(`Factura "${invoiceNumber}" no encontrada.`);
    if (!response.ok) {
      this.logger.warn(`Dynamics respondió ${response.status} para ${url}`);
      throw new BadGatewayException(`La API de Dynamics respondió ${response.status}.`);
    }

    try {
      return await response.json();
    } catch {
      throw new BadGatewayException('La API de Dynamics no devolvió un JSON válido.');
    }
  }

  /** Sustituye `{numero}` en la URL configurada (o lo añade al final). */
  private buildUrl(invoiceNumber: string): string {
    const template = this.config.get('DYNAMICS_API_URL', { infer: true });
    const encoded = encodeURIComponent(invoiceNumber.trim());
    return template.includes('{numero}')
      ? template.replace('{numero}', encoded)
      : `${template.replace(/\/$/, '')}/${encoded}`;
  }
}
