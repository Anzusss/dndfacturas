/**
 * @file Gestión de columnas de la tabla de renglones: elegir qué dato del
 * renglón muestra cada columna, quitar columnas y agregar nuevas.
 */

import { Plus, X } from 'lucide-react';
import { ITEM_FIELDS } from '@/domain/constants/dynamicsVariables';
import { createCustomColumn } from '@/domain/models/tableColumns';
import { PropertySection } from './PropertySection';

/**
 * @param {Object}   props
 * @param {Object}   props.element       Bloque de tipo TABLE.
 * @param {Function} props.updateElement Acción del store `(id, cambios) => void`.
 */
export const TableProperties = ({ element, updateElement }) => {
  const columns = element.columns ?? [];

  /** Reemplaza la lista de columnas del bloque. */
  const setColumns = (updated) => updateElement(element.id, { columns: updated });

  /** Cambia el dato que muestra una columna (vacío = columna libre). */
  const setColumnField = (columnIndex, field) =>
    setColumns(columns.map((column, index) => (index === columnIndex ? { ...column, field: field || null } : column)));

  /** Quita la columna en la posición indicada. */
  const removeColumn = (columnIndex) => setColumns(columns.filter((_, index) => index !== columnIndex));

  /** Pide el nombre y añade una columna al final (luego se elige su dato). */
  const addColumn = () => {
    const name = window.prompt('Nombre de la nueva columna:')?.trim();
    if (name) setColumns([...columns, createCustomColumn(name)]);
  };

  return (
    <PropertySection
      title="Columnas de la Tabla"
      action={
        <button
          type="button"
          onClick={addColumn}
          className="text-[10px] text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>Agregar</span>
        </button>
      }
    >
      <div className="space-y-1.5">
        {columns.map((column, index) => (
          <div
            key={`${column.label}-${index}`}
            className="bg-white px-2 py-1.5 rounded border border-neutral-200 text-[11px] space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-neutral-800 truncate font-medium">{column.label}</span>
              <button
                type="button"
                onClick={() => removeColumn(index)}
                className="text-neutral-400 hover:text-error-500 p-0.5"
                title="Eliminar columna"
                aria-label={`Eliminar columna ${column.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <select
              value={column.field ?? ''}
              onChange={(e) => setColumnField(index, e.target.value)}
              aria-label={`Dato de la columna ${column.label}`}
              className="input-field input-field-sm w-full text-[10px]"
            >
              <option value="">— Columna vacía —</option>
              {ITEM_FIELDS.map((field) => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </PropertySection>
  );
};
