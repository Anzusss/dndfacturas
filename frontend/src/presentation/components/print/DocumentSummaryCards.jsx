import { CalendarDays, CircleDollarSign, FileText, Loader2, RefreshCw, UserRound } from 'lucide-react';

const moneyFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatMoney = (value) => {
  const amount = Number.parseFloat(String(value ?? '').trim());
  return Number.isFinite(amount) ? moneyFormatter.format(amount) : 'Sin total';
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-VE');
};

export const DocumentSummaryCards = ({ documents, loading, error, onSelect }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-8 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando facturas disponibles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-600">
        <span>{error}</span>
        <button type="button" className="btn-secondary px-2.5 py-1.5 text-xs" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-1.5 inline h-3.5 w-3.5" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-3" aria-labelledby="available-documents-title">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="available-documents-title" className="text-sm font-bold text-heading">
            Facturas disponibles
          </h2>
          <p className="text-xs text-muted">Selecciona una factura para cargar sus datos completos.</p>
        </div>
        <span className="badge badge-neutral">{documents.length} documentos</span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => {
          const number = String(document.document_number ?? '').trim();
          return (
            <button
              key={number}
              type="button"
              onClick={() => onSelect(number)}
              className="card card-hover w-full p-4 text-left transition hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-bold text-neutral-900">{number}</p>
                    <p className="text-[11px] text-muted">{document.document_type || 'Documento'}</p>
                  </div>
                </div>
                <span className="badge badge-success shrink-0">{document.document_status || 'Emitido'}</span>
              </div>

              <div className="mt-3 space-y-2 text-xs text-neutral-600">
                <p className="flex items-center gap-2 truncate" title={document.customer_name}>
                  <UserRound className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                  <span className="truncate">{document.customer_name || 'Cliente sin nombre'}</span>
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                    {formatDate(document.document_date)}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                    <CircleDollarSign className="h-3.5 w-3.5 text-success-600" />
                    {formatMoney(document.total_transaction)}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted">RIF: {document.rif || 'Sin RIF'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};