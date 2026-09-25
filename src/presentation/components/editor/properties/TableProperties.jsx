import React from 'react';
import { Plus, X } from 'lucide-react';

/**
 * Componente TableProperties
 * Administra las columnas de la tabla de renglones de la factura:
 * - Permite remover columnas existentes mediante el botón 'X'.
 * - Permite incorporar nuevas columnas personalizadas mediante un prompt.
 *
 * @param {Object} props
 * @param {Object} props.selectedElement - Elemento tipo TABLE actualmente seleccionado.
 * @param {Function} props.updateElement - Función del store para actualizar el arreglo `columns`.
 */
export const TableProperties = ({ selectedElement, updateElement }) => {
  // Elimina una columna por su índice posicional
  const removeTableColumn = (colIndex) => {
    const updated = (selectedElement.columns || []).filter((_, idx) => idx !== colIndex);
    updateElement(selectedElement.id, { columns: updated });
  };

  // Solicita el nombre y añade una nueva columna al final de la tabla
  const addTableColumn = () => {
    const newColName = prompt('Nombre de la nueva columna:');
    if (newColName && newColName.trim()) {
      const updated = [...(selectedElement.columns || []), newColName.trim()];
      updateElement(selectedElement.id, { columns: updated });
    }
  };

  return (
    <div className="space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-neutral-700">
          Columnas de la Tabla
        </span>
        <button
          onClick={addTableColumn}
          className="text-[10px] text-primary-600 hover:text-primary-700 flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>Agregar</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {selectedElement.columns?.map((col, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white px-2 py-1 rounded border border-neutral-200 text-[11px]"
          >
            <span className="text-neutral-800 truncate">{col}</span>
            <button
              onClick={() => removeTableColumn(idx)}
              className="text-neutral-400 hover:text-error-500 p-0.5"
              title="Eliminar columna"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
