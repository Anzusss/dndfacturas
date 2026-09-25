import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZoomControls } from './header/ZoomControls';
import { Printer, Save, FileText, RotateCw } from 'lucide-react';
import { printInvoice } from '@/utils/printUtils';

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

  const handlePrint = () => {
    const wasInPreview = previewMode;
    if (!wasInPreview) setPreviewMode(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        printInvoice();
        if (!wasInPreview) {
          setTimeout(() => {
            setPreviewMode(false);
          }, 300);
        }
      });
    });
  };

  const handleReset = () => {
    if (window.confirm('¿Deseas restaurar la plantilla al estado inicial por defecto?')) {
      resetToDefault();
    }
  };

  return (
    <header className="no-print h-14 bg-white border-b border-neutral-200 text-neutral-800 px-4 flex items-center justify-between select-none shadow-sm z-10">
      {/* Información del documento */}
      <div className="flex items-center space-x-3">
        <div className="bg-primary-50 border border-primary-100 p-1.5 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-heading flex items-center gap-2">
            {template.name}
            <span className="badge badge-primary text-xs font-mono font-medium">
              Carta (216 × 279 mm)
            </span>
          </h1>
          <p className="text-[11px] text-muted">
            Márgenes físicos: Membrete {template.pageSetup.paddingTop} | Colecta {template.pageSetup.paddingBottom}
          </p>
        </div>
      </div>

      {/* Controles centrales */}
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        showGridLines={showGridLines}
        toggleGridLines={toggleGridLines}
      />

      {/* Acciones */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleReset}
          className="btn-secondary px-2.5 py-1.5 text-xs font-medium flex items-center gap-1.5"
          title="Restaurar valores iniciales"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        <button
          onClick={onSave}
          className="btn-primary px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar</span>
        </button>

        <button
          onClick={handlePrint}
          className="btn-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Probar Impresión</span>
        </button>
      </div>
    </header>
  );
};