/**
 * @file Botones inferiores del panel de propiedades: duplicar y eliminar el
 * bloque seleccionado.
 */

import { Copy, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

/**
 * @param {Object} props
 * @param {string} props.elementId Id del bloque seleccionado.
 */
export const BlockActions = ({ elementId }) => {
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const removeElement = useEditorStore((s) => s.removeElement);

  return (
    <div className="pt-3 border-t border-neutral-200 space-y-2">
      {/* Clona el bloque con un pequeño desfase */}
      <button
        type="button"
        onClick={() => duplicateElement(elementId)}
        className="btn-secondary w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs"
      >
        <Copy className="w-3.5 h-3.5" />
        <span>Duplicar Bloque</span>
      </button>

      {/* Quita el bloque de la hoja */}
      <button
        type="button"
        onClick={() => removeElement(elementId)}
        className="btn-danger w-full py-2 px-3 flex items-center justify-center gap-1.5 text-xs"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Eliminar Bloque</span>
      </button>
    </div>
  );
};
