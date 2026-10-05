/**
 * @file Fila de la tabla de impresiones.
 */

import { Calendar, User } from 'lucide-react';
import { PRINT_STATUS } from '@/domain/models/printLog';
import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';

/** Estilo y texto de la insignia según el estado del registro. */
const STATUS_BADGE = {
  [PRINT_STATUS.SUCCESS]: { className: 'badge-success', label: 'Impresa' },
  [PRINT_STATUS.TEST]: { className: 'badge-warning', label: 'Prueba' },
};

/**
 * @param {Object} props
 * @param {Object} props.log Registro de impresión.
 */
export const AuditLogRow = ({ log }) => {
  const badge = STATUS_BADGE[log.status] ?? { className: 'badge-neutral', label: log.status };

  return (
    <tr className="table-row">
      <td className="p-3 font-semibold text-primary-600">{log.invoiceId}</td>
      <td className="p-3 font-sans text-neutral-700">{INVOICE_TYPE_LABELS[log.invoiceType] ?? '—'}</td>
      <td className="p-3 text-neutral-700">
        {log.templateId}
        {/* Registros antiguos no guardaban la versión. */}
        {log.templateVersion != null && <span className="text-muted"> · v{log.templateVersion}</span>}
      </td>
      <td className="p-3 text-neutral-600 font-sans">
        {/* El flex va en un <span>: aplicado al <td> rompía el layout de la tabla. */}
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-subtle" />
          {log.user}
        </span>
      </td>
      <td className="p-3 text-neutral-600 font-sans">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-subtle" />
          {new Date(log.printedAt).toLocaleString('es-VE')}
        </span>
      </td>
      <td className="p-3 text-center font-bold text-neutral-900">{log.copies}</td>
      <td className="p-3 text-right">
        <span className={`badge ${badge.className}`}>{badge.label}</span>
      </td>
    </tr>
  );
};
