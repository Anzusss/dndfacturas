import { ArrowLeft, Printer } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PERMISSIONS } from '@/domain/models/permissions';
import { useInvoicePrint } from '@/presentation/hooks/useInvoicePrint';
import { usePermission } from '@/presentation/hooks/useCurrentUser';
import { useToast } from '@/presentation/hooks/useToast';
import { PageHeader } from '@/presentation/components/common/PageHeader';
import { Toast } from '@/presentation/components/common/Toast';
import { PrintChecklist } from '@/presentation/components/print/PrintChecklist';
import { InvoicePreview } from '@/presentation/components/print/InvoicePreview';
import { DataInspector } from '@/presentation/components/print/DataInspector';

export const PrintDetailsPage = () => {
  const { invoiceNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, error, prepared, loadDocumentDetails, loadFromJson, print } = useInvoicePrint();
  const canPrint = usePermission(PERMISSIONS.PRINT_INVOICES);
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (invoiceNumber) {
      loadDocumentDetails(invoiceNumber);
    } else if (location.state?.jsonText) {
      loadFromJson(location.state.jsonText);
    }
  }, [invoiceNumber, location.state, loadDocumentDetails, loadFromJson]);

  const handlePrint = async () => {
    try {
      if (await print()) showToast('Impresión enviada y registrada en auditoría.');
    } catch (printError) {
      showToast(printError.message, 'error');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 p-8 text-neutral-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          icon={Printer}
          title={`Detalle de factura ${invoiceNumber || ''}`}
          description="Datos completos del documento y vista previa con la plantilla activa."
          showNavigation={false}
          actions={
            <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={() => navigate('/facturacion/print')}>
              <ArrowLeft className="mr-1.5 inline h-3.5 w-3.5" />
              Volver a facturas
            </button>
          }
        />

        {status === 'loading' && <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-muted">Cargando detalle de la factura...</div>}
        {status === 'error' && <div className="rounded-lg border border-error-100 bg-error-50 p-3 text-xs text-error-600">{error}</div>}

        {status === 'ready' && prepared && (
          <>
            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <div className="w-full shrink-0 lg:w-80">
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