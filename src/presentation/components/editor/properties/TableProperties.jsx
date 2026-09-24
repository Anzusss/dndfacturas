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
    <div className="space-y-2 p-3 bg-slate-800/40 rounded-lg border border-slate-800">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-slate-300">
          Columnas de la Tabla
        </span>
        <button
          onClick={addTableColumn}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>Agregar</span>
        </button>
      </div>

      <div className="space-y-1.5">
        {selectedElement.columns?.map((col, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]"
          >
            <span className="text-slate-200 truncate">{col}</span>
            <button
              onClick={() => removeTableColumn(idx)}
              className="text-slate-500 hover:text-rose-400 p-0.5"
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
