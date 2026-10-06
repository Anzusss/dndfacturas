/**
 * @file Página "Imprimir factura" (ruta "/print").
 *
 * Flujo: buscar factura → se traduce el JSON de la API → se elige la
 * plantilla activa de su tipo → vista previa y comprobaciones → imprimir →
 * queda registrada en la auditoría con la plantilla y versión usadas.
 */

import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentSummaryService } from '@/services/invoiceApi/documentSummaryService';
import { PageHeader } from '@/presentation/components/common/PageHeader';
import { InvoiceLookupForm } from '@/presentation/components/print/InvoiceLookupForm';
import { DocumentSummaryCards } from '@/presentation/components/print/DocumentSummaryCards';

export const PrintPage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [documentsStatus, setDocumentsStatus] = useState('loading');
  const [documentsError, setDocumentsError] = useState(null);

  const openDetails = (invoiceNumber) => {
    navigate(`/facturacion/print/${encodeURIComponent(String(invoiceNumber).trim())}`);
  };

  const openJsonDetails = (jsonText) => {
    navigate('/facturacion/print/json', { state: { jsonText } });
  };

  useEffect(() => {
    let cancelled = false;
    setDocumentsStatus('loading');
    documentSummaryService
      .list()
      .then((items) => {
        if (cancelled) return;
        setDocuments(items);
        setDocumentsStatus('ready');
      })
      .catch((loadError) => {
        if (cancelled) return;
        setDocumentsError(loadError.message);
        setDocumentsStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          icon={Printer}
          title="Imprimir Factura"
          description="Busca una factura de Dynamics y se imprimirá con la plantilla activa de su tipo."
        />

        <InvoiceLookupForm loading={false} onSearch={openDetails} onLoadJson={openJsonDetails} />

        <DocumentSummaryCards
          documents={documents}
          loading={documentsStatus === 'loading'}
          error={documentsStatus === 'error' ? documentsError : null}
          onSelect={openDetails}
        />
      </div>
    </div>
  );
};
