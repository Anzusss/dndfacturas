/**
 * @file Tabla del historial de cambios de plantillas (para la gerente).
 */

import { HISTORY_ACTIONS, HISTORY_ACTION_LABELS } from '@/domain/models/templateLifecycle';
import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';

/** Color de la insignia según la acción. */
const ACTION_BADGE = {
  [HISTORY_ACTIONS.APPROVED]: 'badge-success',
  [HISTORY_ACTIONS.ACTIVATED]: 'badge-success',
  [HISTORY_ACTIONS.REJECTED]: 'badge-error',
  [HISTORY_ACTIONS.SUBMITTED]: 'badge-warning',
};

const COLUMNS = ['Fecha y Hora', 'Plantilla', 'Versión', 'Tipo', 'Acción', 'Usuario', 'Comentario'];

/**
 * @param {Object}   props
 * @param {Object[]} props.entries Entradas del historial ya filtradas.
 */
export const TemplateHistoryTable = ({ entries }) => (
  <div className="table-container">
    <table className="w-full text-xs text-left">
      <thead className="table-header">
        <tr>
          {COLUMNS.map((label) => (
            <th key={label} className="p-3">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 text-[11px]">
        {entries.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length} className="p-8 text-center text-muted">
              Aún no hay cambios registrados con los filtros seleccionados.
            </td>
          </tr>
        ) : (
          entries.map((entry) => (
            <tr key={entry.id} className="table-row">
              <td className="p-3 text-neutral-600">{new Date(entry.at).toLocaleString('es-VE')}</td>
              <td className="p-3">
                <div className="font-semibold text-neutral-800">{entry.templateName}</div>
                <div className="font-mono text-[10px] text-muted">{entry.templateId}</div>
              </td>
              <td className="p-3 font-mono">v{entry.version}</td>
              <td className="p-3">{INVOICE_TYPE_LABELS[entry.invoiceType] ?? '—'}</td>
              <td className="p-3">
                <span className={`badge ${ACTION_BADGE[entry.action] ?? 'badge-neutral'}`}>
                  {HISTORY_ACTION_LABELS[entry.action] ?? entry.action}
                </span>
              </td>
              <td className="p-3 text-neutral-600">{entry.user}</td>
              <td className="p-3 text-neutral-600">{entry.comment ?? ''}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
