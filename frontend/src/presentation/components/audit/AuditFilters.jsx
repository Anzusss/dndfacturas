/**
 * @file Barra de filtros de la auditoría: búsqueda libre y periodo.
 */

import { Filter, Search } from 'lucide-react';
import { AUDIT_PERIODS } from '@/domain/models/printLog';

/**
 * @param {Object} props
 * @param {string} props.search
 * @param {(value:string) => void} props.onSearchChange
 * @param {string} props.period Id del periodo activo (ver AUDIT_PERIODS).
 * @param {(id:string) => void} props.onPeriodChange
 * @param {string} [props.placeholder] Texto de ayuda del buscador.
 */
export const AuditFilters = ({
  search,
  onSearchChange,
  period,
  onPeriodChange,
  placeholder = 'Buscar por Factura No. o Usuario...',
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
    <label className="flex items-center space-x-2">
      <Search className="w-4 h-4 text-subtle" />
      <input
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input-field input-field-sm w-64"
      />
    </label>

    <div className="flex items-center space-x-2">
      <Filter className="w-3.5 h-3.5 text-subtle" />
      <span className="text-xs text-muted">Rango:</span>
      {AUDIT_PERIODS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={period === id}
          onClick={() => onPeriodChange(id)}
          className={`px-3 py-1 text-xs rounded-lg transition ${
            period === id
              ? 'bg-primary-600 text-white font-medium'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);
