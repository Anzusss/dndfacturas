import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Eye, Edit3 } from 'lucide-react';

/**
 * Componente ZoomControls
 * Agrupa los controles centrales del encabezado del editor:
 * 1. Zoom Out / Zoom In: Ajusta la escala entre 50% y 180% en pasos de 10%.
 * 2. Reset Zoom: Restablece la vista al 100% (escala real).
 * 3. Botón Guías: Alterna la visibilidad de las marcas de margen físico de 50mm y 40mm.
 * 4. Botón Vista Previa / Edición: Alterna entre el modo de diseño interactivo (con controles y bordes)
 *    y la vista final limpia idéntica al documento impreso.
 *
 * @param {Object} props
 * @param {number} props.zoom - Escala actual (ej. 1 = 100%).
 * @param {Function} props.setZoom - Setter para actualizar el zoom en el store.
 * @param {boolean} props.previewMode - Estado activo del modo vista previa.
 * @param {Function} props.setPreviewMode - Setter del modo vista previa.
 * @param {boolean} props.showGridLines - Si las guías de margen están visibles.
 * @param {Function} props.toggleGridLines - Función para alternar visibilidad de guías.
 */
export const ZoomControls = ({
  zoom,
  setZoom,
  previewMode,
  setPreviewMode,
  showGridLines,
  toggleGridLines,
}) => {
  return (
    <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-lg border border-neutral-200 select-none">
      {/* Reducir zoom (Mínimo 50%) */}
      <button
        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
        className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600 hover:text-neutral-900 transition"
        title="Reducir zoom"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Porcentaje actual */}
      <span className="text-xs font-mono w-12 text-center text-neutral-700">
        {Math.round(zoom * 100)}%
      </span>

      {/* Aumentar zoom (Máximo 180%) */}
      <button
        onClick={() => setZoom(Math.min(1.8, zoom + 0.1))}
        className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600 hover:text-neutral-900 transition"
        title="Aumentar zoom"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Restablecer zoom al 100% */}
      <button
        onClick={() => setZoom(1)}
        className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600 hover:text-neutral-900 transition"
        title="Zoom 100%"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-neutral-300 mx-1" />

      {/* Toggle de guías de margen físico */}
      <button
        onClick={toggleGridLines}
        className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition ${
          showGridLines
            ? 'bg-primary-100 text-primary-700 border border-primary-200'
            : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900'
        }`}
        title="Mostrar/Ocultar guías de margen físico"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Guías</span>
      </button>

      {/* Toggle entre modo edición interactiva y vista previa limpia */}
      <button
        onClick={() => setPreviewMode(!previewMode)}
        className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition ${
          previewMode
            ? 'bg-warning-100 text-warning-700 border border-warning-200'
            : 'text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
        }`}
        title="Alternar entre modo edición y vista previa exacta"
      >
        {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span>{previewMode ? 'Modo Edición' : 'Vista Previa'}</span>
      </button>
    </div>
  );
};
