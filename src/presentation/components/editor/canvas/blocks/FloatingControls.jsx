/**
 * @file Barra flotante sobre el bloque seleccionado: muestra posición y
 * tamaño en vivo y permite duplicar o eliminar el bloque.
 * Solo se monta cuando el bloque está seleccionado (lo decide RndBlockWrapper).
 */

import { Copy, Trash2, Move } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';

/**
 * @param {Object} props
 * @param {string} props.elementId
 * @param {{x:number, y:number, width:number, height:number}} props.rect
 *   Geometría actual (incluye los valores en vivo durante el arrastre).
 */
export const FloatingControls = ({ elementId, rect }) => {
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const removeElement = useEditorStore((s) => s.removeElement);

  return (
    <div
      className="no-print absolute -top-8 left-0 z-40 bg-white border border-neutral-200 shadow-lg rounded-md px-2 py-0.5 flex items-center space-x-2 text-[10px] text-neutral-700 pointer-events-auto select-none"
      // Evita que el clic en la barra vuelva a seleccionar/deseleccionar el bloque.
      onClick={(event) => event.stopPropagation()}
    >
      <span className="flex items-center gap-1 font-mono text-primary-600 border-r border-neutral-200 pr-1.5">
        <Move className="w-3 h-3 text-primary-500" />
        <span>{Math.round(rect.x)},{Math.round(rect.y)}</span>
        <span className="text-neutral-400 font-sans">|</span>
        <span>{Math.round(rect.width)}×{Math.round(rect.height)}px</span>
      </span>

      <button
        type="button"
        onClick={() => duplicateElement(elementId)}
        title="Duplicar bloque"
        aria-label="Duplicar bloque"
        className="p-1 hover:text-neutral-900 hover:bg-neutral-100 rounded transition"
      >
        <Copy className="w-3 h-3" />
      </button>

      <button
        type="button"
        onClick={() => removeElement(elementId)}
        title="Eliminar bloque"
        aria-label="Eliminar bloque"
        className="p-1 text-error-500 hover:text-error-600 hover:bg-error-50 rounded transition"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
