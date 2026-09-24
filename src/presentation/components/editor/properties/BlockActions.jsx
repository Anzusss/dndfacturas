import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

/**
 * Componente BlockActions
 * Botonera inferior del panel de propiedades para ejecutar acciones destructivas
 * o de duplicación sobre el bloque activo.
 *
 * @param {Object} props
 * @param {string} props.selectedElementId - ID único del elemento activo.
 * @param {Function} props.duplicateElement - Función del store para clonar el elemento.
 * @param {Function} props.removeElement - Función del store para eliminar el elemento.
 */
export const BlockActions = ({ selectedElementId, duplicateElement, removeElement }) => {
  return (
    <div className="pt-3 border-t border-slate-800 space-y-2">
      {/* Botón para duplicar bloque con desfase */}
      <button
        onClick={() => duplicateElement(selectedElementId)}
        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition text-xs"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplicar Bloque</span>
      </button>

      {/* Botón para remover permanentemente el bloque del lienzo */}
      <button
        onClick={() => removeElement(selectedElementId)}
        className="w-full py-2 px-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 rounded-lg flex items-center justify-center gap-1.5 transition text-xs"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Eliminar Bloque</span>
      </button>
    </div>
  );
};
