/**
 * @file Página "Imprimir factura" (ruta "/print").
 *
 * Flujo: buscar factura → se traduce el JSON de la API → se elige la
 * plantilla activa de su tipo → vista previa y comprobaciones → imprimir →
 * queda registrada en la auditoría con la plantilla y versión usadas.
 */

import { Printer } from 'lucide-react';
import { PERMISSIONS } from '@/domain/models/permissions';
import { useInvoicePrint } from '@/presentation/hooks/useInvoicePrint';
import { usePermission } from '@/presentation/hooks/useCurrentUser';
import { useToast } from '@/presentation/hooks/useToast';
import { PageHeader } from '@/presentation/components/common/PageHeader';
import { Toast } from '@/presentation/components/common/Toast';
import { InvoiceLookupForm } from '@/presentation/components/print/InvoiceLookupForm';
import { PrintChecklist } from '@/presentation/components/print/PrintChecklist';
import { InvoicePreview } from '@/presentation/components/print/InvoicePreview';
import { DataInspector } from '@/presentation/components/print/DataInspector';

export const PrintPage = () => {
  const { status, error, prepared, searchByNumber, loadFromJson, print } = useInvoicePrint();
  const canPrint = usePermission(PERMISSIONS.PRINT_INVOICES);
  const { toast, showToast } = useToast();

  /** Imprime y avisa del resultado. */
  const handlePrint = async () => {
    try {
      if (await print()) showToast('Impresión enviada y registrada en auditoría.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          icon={Printer}
          title="Imprimir Factura"
          description="Busca una factura de Dynamics y se imprimirá con la plantilla activa de su tipo."
        />

        <InvoiceLookupForm loading={status === 'loading'} onSearch={searchByNumber} onLoadJson={loadFromJson} />

        {status === 'error' && (
          <div className="p-3 rounded-lg border border-error-100 bg-error-50 text-error-600 text-xs">{error}</div>
        )}

        {status === 'ready' && prepared && (
          <>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-full lg:w-80 shrink-0">
                <PrintChecklist prepared={prepared} canPrint={canPrint} onPrint={handlePrint} />
              </div>
              {prepared.template && (
                <div className="overflow-x-auto">
                  <InvoicePreview template={prepared.template} data={prepared.invoice} />
                </div>
              )}
            </div>
            <DataInspector raw={prepared.raw} invoice={prepared.invoice} />
          </>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  );
};
