import React from 'react';
import { Move } from 'lucide-react';

/**
 * Componente PositionSizeControls
 * Expone cuatro campos numéricos (inputs) para ajustar con precisión de píxeles:
 * - Coordenada X (distancia desde el borde izquierdo de la hoja).
 * - Coordenada Y (distancia desde el borde superior de la hoja).
 * - Ancho (Width) del bloque en píxeles.
 * - Alto (Height) del bloque en píxeles.
 *
 * Mantiene sincronía bidireccional con el arrastre y redimensionado de react-rnd.
 *
 * @param {Object} props
 * @param {Object} props.selectedElement - Elemento actualmente activo.
 * @param {Function} props.updateElement - Función del store para persistir los cambios.
 */
export const PositionSizeControls = ({ selectedElement, updateElement }) => {
  return (
    <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
      {/* Título de la sección */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-primary-600 flex items-center gap-1">
          <Move className="w-3 h-3 text-primary-500" />
          Posición y Dimensiones (px)
        </span>
      </div>

      {/* Controles numéricos para coordenadas X e Y */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted block mb-1">X (Horizontal)</label>
          <input
            type="number"
            value={Math.round(selectedElement.x || 0)}
            onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value, 10) || 0 })}
            className="input-field w-full font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted block mb-1">Y (Vertical)</label>
          <input
            type="number"
            value={Math.round(selectedElement.y || 0)}
            onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value, 10) || 0 })}
            className="input-field w-full font-mono text-xs"
          />
        </div>
      </div>

      {/* Controles numéricos para Ancho y Alto */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200">
        <div>
          <label className="text-[10px] text-muted block mb-1">Ancho (Width)</label>
          <input
            type="number"
            value={Math.round(selectedElement.width || 0)}
            onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value, 10) || 50 })}
            className="input-field w-full font-mono text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted block mb-1">Alto (Height)</label>
          <input
            type="number"
            value={Math.round(selectedElement.height || 0)}
            onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value, 10) || 30 })}
            className="input-field w-full font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
