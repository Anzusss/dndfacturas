/**
 * @file Tabla con el historial de impresiones.
 */

import { AuditLogRow } from './AuditLogRow';

/** Encabezados de la tabla con su alineación. */
const COLUMNS = [
  { label: 'Factura No.' },
  { label: 'Tipo' },
  { label: 'Plantilla (versión)' },
  { label: 'Usuario' },
  { label: 'Fecha y Hora' },
  { label: 'Copias', className: 'text-center' },
  { label: 'Estado', className: 'text-right' },
];

/**
 * @param {Object}   props
 * @param {Object[]} props.logs Registros ya filtrados.
 */
export const AuditLogTable = ({ logs }) => (
  <div className="table-container">
    <table className="w-full text-xs text-left">
      <thead className="table-header">
        <tr>
          {COLUMNS.map(({ label, className = '' }) => (
            <th key={label} className={`p-3 ${className}`}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
        {logs.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length} className="p-8 text-center text-muted">
              No se encontraron registros de impresión con los filtros seleccionados.
            </td>
          </tr>
        ) : (
          logs.map((log) => <AuditLogRow key={log.id} log={log} />)
        )}
      </tbody>
    </table>
  </div>
);
