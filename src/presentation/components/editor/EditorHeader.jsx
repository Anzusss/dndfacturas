import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZoomControls } from './header/ZoomControls';
import { Printer, Save, FileText, RotateCw } from 'lucide-react';
// Asegúrate de importar la función desde la ruta correcta donde creaste el archivo
import { printInvoice } from '@/utils/printUtils';

/**
 * Componente EditorHeader (Barra Superior del Editor)
 * Presenta el título de la plantilla activa, especificaciones de papel y las acciones principales:
 * - Controles de zoom y alternancia de modo (ZoomControls).
 * - Botón "Restaurar": Devuelve la plantilla a su estado predeterminado de fábrica.
 * - Botón "Guardar": Persiste la plantilla.
 * - Botón "Probar Impresión": Llama a la utilidad de impresión aislada.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback invocado al presionar el botón Guardar.
 */
export const EditorHeader = ({ onSave }) => {
  const {
    zoom,
    setZoom,
    previewMode,
    setPreviewMode,
    showGridLines,
    toggleGridLines,
    template,
    resetToDefault,
  } = useEditorStore();

  /**
   * Prepara la vista y ejecuta la impresión aislada.
   */
  const handlePrint = () => {
    // 1. Activa previewMode para limpiar la UI de los controles del editor
    const wasInPreview = previewMode;
    if (!wasInPreview) setPreviewMode(true);

    // 2. Espera a que React actualice el DOM (oculte bordes y selectores)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 3. Llama a nuestra nueva utilidad externa que maneja el iframe
        printInvoice();

        // 4. Restaura el modo de edición después de darle tiempo a printUtils
        // para clonar el HTML del DOM
        if (!wasInPreview) {
          setTimeout(() => {
            setPreviewMode(false);
          }, 300); // 300ms es suficiente para que JS lea el innerHTML clonado
        }
      });
    });
  };

  /**
   * Restaura la plantilla a su diseño original tras solicitar confirmación al usuario.
   */
  const handleReset = () => {
    if (window.confirm('¿Deseas restaurar la plantilla al estado inicial por defecto?')) {
      resetToDefault();
    }
  };

  return (
    <header className="no-print h-14 bg-slate-900 border-b border-slate-800 text-slate-100 px-4 flex items-center justify-between select-none">
      {/* Sección Izquierda: Identificador y metadatos del documento */}
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
            {template.name}
            <span className="text-xs font-mono font-normal text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
              Carta (216 × 279 mm)
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">
            Márgenes físicos: Membrete {template.pageSetup.paddingTop} | Colecta {template.pageSetup.paddingBottom}
          </p>
        </div>
      </div>

      {/* Sección Central: Controles de Zoom, Guías y Modo Vista Previa */}
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        showGridLines={showGridLines}
        toggleGridLines={toggleGridLines}
      />

      {/* Sección Derecha: Acciones globales (Restaurar, Guardar, Imprimir) */}
      <div className="flex items-center space-x-2">
        {/* Restaurar valores por defecto */}
        <button
          onClick={handleReset}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
          title="Restaurar valores iniciales"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        {/* Guardar plantilla */}
        <button
          onClick={onSave}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar</span>
        </button>

        {/* Lanzar diálogo de impresión */}
        <button
          onClick={handlePrint}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/30 transition active:scale-95"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Probar Impresión</span>
        </button>
      </div>
    </header>
  );
};