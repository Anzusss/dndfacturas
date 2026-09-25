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
    <div className="pt-3 border-t border-neutral-200 space-y-2">
      {/* Botón para duplicar bloque con desfase */}
      <button
        onClick={() => duplicateElement(selectedElementId)}
        className="btn-secondary w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplicar Bloque</span>
      </button>

      {/* Botón para remover permanentemente el bloque del lienzo */}
      <button
        onClick={() => removeElement(selectedElementId)}
        className="btn-danger w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Eliminar Bloque</span>
      </button>
    </div>
  );
};
