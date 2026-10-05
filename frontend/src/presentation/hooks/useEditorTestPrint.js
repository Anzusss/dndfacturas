/**
 * @file Hook de la impresión de PRUEBA desde el editor (con datos de muestra).
 *
 * Pasos:
 * 1. Activa la vista previa (oculta guías, bordes y controles del editor).
 * 2. Clona la hoja e imprime (`printInvoice`).
 * 3. Restaura el modo en que estaba el usuario.
 * 4. Registra el evento en la auditoría.
 *
 * Antes el editor importaba `auditService` pero nunca lo llamaba, por lo que
 * las impresiones no quedaban auditadas. Ahora se registran con estado
 * `TEST` para distinguirlas de las impresiones de facturas reales.
 */

import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useEditorStore } from '@/store/useEditorStore';
import { printInvoice } from '@/utils/printUtils';
import { auditService } from '@/services/auditService';
import { PRINT_STATUS, TEST_PRINT_INVOICE_ID } from '@/domain/models/printLog';
import { useCurrentUser } from './useCurrentUser';

/**
 * @returns {() => Promise<void>} Función que lanza la impresión.
 */
export const useEditorTestPrint = () => {
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
  const user = useCurrentUser();

  return useCallback(async () => {
    // Se lee el estado en el momento del clic (no en el render) para evitar valores obsoletos.
    const { previewMode: wasInPreview, template } = useEditorStore.getState();

    // flushSync aplica la vista previa en el DOM de forma síncrona, así la
    // hoja clonada ya no contiene guías ni bordes de edición. Sustituye al
    // doble requestAnimationFrame anterior, que no se dispara si la pestaña
    // no está pintando y dejaba el editor atascado en vista previa.
    if (!wasInPreview) flushSync(() => setPreviewMode(true));

    // printInvoice captura el HTML de forma síncrona, así que se puede
    // restaurar el modo de edición inmediatamente después.
    const printed = printInvoice();
    if (!wasInPreview) setPreviewMode(false);

    if (!printed) return;
    try {
      await auditService.recordPrintEvent({
        invoiceId: TEST_PRINT_INVOICE_ID,
        invoiceType: template.invoiceType,
        templateId: template.templateId,
        templateVersion: template.version,
        user,
        status: PRINT_STATUS.TEST,
      });
    } catch (error) {
      // La impresión ya se lanzó; un fallo de registro no debe romper la UI.
      console.error('No se pudo registrar la impresión en la auditoría:', error);
    }
  }, [setPreviewMode, user]);
};
