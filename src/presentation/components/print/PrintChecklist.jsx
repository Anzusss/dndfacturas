/**
 * @file Resumen previo a imprimir: tipo, plantilla que se usará, errores,
 * avisos, campos que faltan y reimpresiones. Incluye el botón de imprimir.
 */

import { AlertTriangle, CheckCircle2, Printer, XCircle } from 'lucide-react';
import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';

/** Lista de mensajes con icono y color según su gravedad. */
const MessageList = ({ items, tone }) => {
  if (items.length === 0) return null;
  const styles = {
    error: { Icon: XCircle, className: 'text-error-600 bg-error-50 border-error-100' },
    warning: { Icon: AlertTriangle, className: 'text-warning-600 bg-warning-50 border-warning-100' },
  }[tone];

  return (
    <ul className={`text-xs border rounded-lg p-2.5 space-y-1 ${styles.className}`}>
      {items.map((message) => (
        <li key={message} className="flex items-start gap-1.5">
          <styles.Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{message}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * @param {Object}   props
 * @param {import('@/services/invoicePrintService').PreparedInvoice} props.prepared
 * @param {boolean}  props.canPrint Permiso del usuario.
 * @param {() => void} props.onPrint
 */
export const PrintChecklist = ({ prepared, canPrint, onPrint }) => {
  const { invoice, template, errors, warnings, missingFields, previousPrints } = prepared;

  // Campos que faltan y reimpresiones son avisos: se puede imprimir igualmente.
  const allWarnings = [
    ...warnings,
    ...(missingFields.length > 0
      ? [`La plantilla usa campos que la factura no trae: ${missingFields.join(', ')}.`]
      : []),
    ...(previousPrints > 0 ? [`Esta factura ya se imprimió ${previousPrints} ${previousPrints === 1 ? 'vez' : 'veces'}.`] : []),
  ];
  const blocked = errors.length > 0 || !template;

  return (
    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted">Factura</dt>
        <dd className="font-mono font-semibold">{invoice.facturaNo ?? '—'}</dd>
        <dt className="text-muted">Tipo</dt>
        <dd>{INVOICE_TYPE_LABELS[invoice.invoiceType] ?? 'Desconocido'}</dd>
        <dt className="text-muted">Plantilla</dt>
        <dd>{template ? `${template.name} · v${template.version}` : '—'}</dd>
      </dl>

      <MessageList items={errors} tone="error" />
      <MessageList items={allWarnings} tone="warning" />

      {!blocked && allWarnings.length === 0 && (
        <p className="text-xs text-success-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Todo listo para imprimir.
        </p>
      )}

      <button
        type="button"
        onClick={onPrint}
        disabled={blocked || !canPrint}
        className="btn-primary w-full px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
        title={canPrint ? undefined : 'Tu rol no tiene permiso para imprimir'}
      >
        <Printer className="w-4 h-4" />
        {previousPrints > 0 ? 'Reimprimir factura' : 'Imprimir factura'}
      </button>
    </div>
  );
};
