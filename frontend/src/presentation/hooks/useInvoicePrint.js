/**
 * @file Estado y acciones de la página "Imprimir factura".
 *
 * Dos formas de cargar una factura:
 * - Por número, desde la API (o el mock si no hay URL configurada).
 * - Pegando un JSON a mano: útil para probar la traducción con el ejemplo
 *   que manden por correo, antes incluso de tener acceso a la API.
 */

import { useCallback, useState } from 'react';
import { invoicePrintService } from '@/services/invoicePrintService';
import { documentSummaryService } from '@/services/invoiceApi/documentSummaryService';
import { printInvoice } from '@/utils/printUtils';
import { useCurrentUser } from './useCurrentUser';

/**
 * @typedef {'idle'|'loading'|'ready'|'error'} LookupStatus
 */

export const useInvoicePrint = () => {
  const user = useCurrentUser();
  /** @type {[LookupStatus, Function]} */
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  /** @type {[import('@/services/invoicePrintService').PreparedInvoice|null, Function]} */
  const [prepared, setPrepared] = useState(null);

  /** Ejecuta la carga común (obtener JSON → preparar) con manejo de estados. */
  const load = useCallback(async (getRaw) => {
    setStatus('loading');
    setError(null);
    setPrepared(null);
    try {
      const raw = await getRaw();
      setPrepared(await invoicePrintService.prepare(raw));
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  /** Busca una factura por número en la API. */
  const searchByNumber = useCallback(
    (invoiceNumber) => load(() => invoicePrintService.fetchRawInvoice(invoiceNumber, user)),
    [load, user],
  );

  /** Carga el detalle completo desde la API de documentos PHP. */
  const loadDocumentDetails = useCallback(
    (invoiceNumber) => load(() => documentSummaryService.getDetails(invoiceNumber)),
    [load],
  );

  /** Carga una factura desde un JSON pegado a mano. */
  const loadFromJson = useCallback(
    (text) =>
      load(async () => {
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('El texto pegado no es un JSON válido.');
        }
      }),
    [load],
  );

  /**
   * Imprime la factura mostrada y registra la impresión.
   * @returns {Promise<boolean>} `true` si se lanzó la impresión.
   */
  const print = async () => {
    if (!prepared?.template || prepared.errors.length > 0) return false;
    if (!printInvoice()) return false;

    const log = await invoicePrintService.recordPrint(prepared, user);
    // Actualiza el contador de impresiones sin volver a llamar a la API.
    setPrepared((current) => current && { ...current, previousPrints: current.previousPrints + 1 });
    return Boolean(log);
  };

  return { status, error, prepared, searchByNumber, loadDocumentDetails, loadFromJson, print };
};
