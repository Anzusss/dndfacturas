/**
 * @file Controles centrales de la cabecera:
 * 1. Zoom − / + (entre ZOOM_LIMITS.MIN y MAX) y restablecer al 100%.
 * 2. Mostrar/ocultar las guías de margen físico.
 * 3. Alternar entre modo edición y vista previa (tal como se imprimirá).
 */

import { ZoomIn, ZoomOut, RotateCcw, Layers, Eye, Edit3 } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZOOM_LIMITS } from '@/domain/constants/editorConfig';

/** Botón cuadrado solo con icono. */
const IconButton = ({ title, onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600 hover:text-neutral-900 transition disabled:opacity-40 disabled:pointer-events-none"
  >
    {children}
  </button>
);

/**
 * Botón con estado activo/inactivo.
 * @param {Object}  props
 * @param {boolean} props.active
 * @param {string}  props.activeClassName Clases a aplicar cuando está activo.
 */
const ToggleButton = ({ active, activeClassName, title, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-pressed={active}
    className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1.5 transition border ${
      active ? activeClassName : 'border-transparent text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
    }`}
  >
    {children}
  </button>
);

export const ZoomControls = () => {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const setPreviewMode = useEditorStore((s) => s.setPreviewMode);
  const showGridLines = useEditorStore((s) => s.showGridLines);
  const toggleGridLines = useEditorStore((s) => s.toggleGridLines);

  return (
    <div className="flex items-center space-x-2 bg-neutral-100 p-1 rounded-lg border border-neutral-200 select-none">
      <IconButton
        title="Reducir zoom"
        onClick={() => setZoom(zoom - ZOOM_LIMITS.STEP)}
        disabled={zoom <= ZOOM_LIMITS.MIN}
      >
        <ZoomOut className="w-4 h-4" />
      </IconButton>

      {/* Porcentaje actual */}
      <span className="text-xs font-mono w-12 text-center text-neutral-700">
        {Math.round(zoom * 100)}%
      </span>

      <IconButton
        title="Aumentar zoom"
        onClick={() => setZoom(zoom + ZOOM_LIMITS.STEP)}
        disabled={zoom >= ZOOM_LIMITS.MAX}
      >
        <ZoomIn className="w-4 h-4" />
      </IconButton>

      <IconButton title="Zoom 100%" onClick={() => setZoom(ZOOM_LIMITS.DEFAULT)}>
        <RotateCcw className="w-3.5 h-3.5" />
      </IconButton>

      <div className="w-px h-4 bg-neutral-300 mx-1" />

      <ToggleButton
        active={showGridLines}
        activeClassName="bg-primary-100 text-primary-700 border-primary-200"
        title="Mostrar/Ocultar guías de margen físico"
        onClick={toggleGridLines}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Guías</span>
      </ToggleButton>

      <ToggleButton
        active={previewMode}
        activeClassName="bg-warning-100 text-warning-600 border-warning-500/40"
        title="Alternar entre modo edición y vista previa exacta"
        onClick={() => setPreviewMode(!previewMode)}
      >
        {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        <span>{previewMode ? 'Modo Edición' : 'Vista Previa'}</span>
      </ToggleButton>
    </div>
  );
};
