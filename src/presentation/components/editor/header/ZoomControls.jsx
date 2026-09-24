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
    <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 select-none">
      {/* Reducir zoom (Mínimo 50%) */}
      <button
        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
        className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
        title="Reducir zoom"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {/* Porcentaje actual */}
      <span className="text-xs font-mono w-12 text-center text-slate-200">
        {Math.round(zoom * 100)}%
      </span>

      {/* Aumentar zoom (Máximo 180%) */}
      <button
        onClick={() => setZoom(Math.min(1.8, zoom + 0.1))}
        className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
        title="Aumentar zoom"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Restablecer zoom al 100% */}
      <button
        onClick={() => setZoom(1)}
        className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
        title="Zoom 100%"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      {/* Toggle de guías de margen físico */}
      <button
        onClick={toggleGridLines}
        className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition ${
          showGridLines
            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
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
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
        title="Alternar entre modo edición y vista previa exacta"
      >
        {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span>{previewMode ? 'Modo Edición' : 'Vista Previa'}</span>
      </button>
    </div>
  );
};
