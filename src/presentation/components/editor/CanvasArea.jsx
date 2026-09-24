import React, { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { MarginGuidelines } from './canvas/MarginGuidelines';
import { RndBlockWrapper } from './canvas/RndBlockWrapper';
import { CanvasGuides } from './canvas/CanvasGuides'; // <-- 1. IMPORTAR AQUÍ

/**
 * Componente CanvasArea (Lienzo Central)
 * Representa la hoja física tamaño Carta (816px × 1054px ≈ 216mm × 279mm).
 */
export const CanvasArea = () => {
  // Referencia al elemento DOM de la hoja para calcular coordenadas relativas al soltar
  const sheetRef = useRef(null);

  const {
    template,
    setSelectedElementId,
    addElement,
    zoom,
    previewMode,
    showGridLines,
  } = useEditorStore();

  const { pageSetup, elements } = template;

  /**
   * Manejador onDrop
   * Se ejecuta cuando el usuario suelta un elemento arrastrado desde la Toolbox sobre la hoja.
   * Calcula la posición exacta (X, Y) considerando la posición de la hoja en pantalla y el nivel de zoom.
   */
  const handleDrop = (e) => {
    e.preventDefault();
    if (previewMode) return; // Evita modificaciones en modo vista previa

    try {
      // Obtiene los metadatos serializados del elemento arrastrado
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const data = JSON.parse(rawData);

      // Obtiene los límites de la hoja en la ventana del navegador
      const sheetRect = sheetRef.current?.getBoundingClientRect();
      if (!sheetRect) return;

      // Convierte coordenadas de pantalla (clientX, clientY) a coordenadas internas de la hoja con zoom
      const rawX = (e.clientX - sheetRect.left) / zoom;
      const rawY = (e.clientY - sheetRect.top) / zoom;

      const elementWidth = data.width || 350;
      const elementHeight = data.height || 120;

      // Limita la posición para que el bloque no se inserte fuera de la hoja
      const clampedX = Math.max(10, Math.min(816 - elementWidth - 10, Math.round(rawX)));
      const clampedY = Math.max(10, Math.min(1054 - elementHeight - 10, Math.round(rawY)));

      // Inserta el nuevo bloque con identificador único y coordenadas calculadas
      addElement({
        ...data,
        id: `${data.type}-${Date.now()}`,
        x: clampedX,
        y: clampedY,
        width: elementWidth,
        height: elementHeight,
      });
    } catch (err) {
      console.error('Error al soltar elemento en el lienzo:', err);
    }
  };

  /**
   * Manejador onDragOver
   * Necesario para habilitar la hoja como destino válido de soltado (dropEffect: copy).
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div
      className="flex-1 overflow-auto bg-slate-900/90 p-8 flex justify-center items-start min-h-0 select-none"
      // Al hacer clic en el fondo gris del escritorio, deselecciona el elemento activo
      onClick={() => setSelectedElementId(null)}
    >
      {/* Contenedor con zoom escalable centrado */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-100 ease-out"
      >
        {/* Hoja física tamaño Carta */}
        <div
          ref={sheetRef}
          id="invoice-print-sheet"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="print-sheet bg-white text-black shadow-2xl relative overflow-hidden"
          style={{
            width: '816px',
            height: '1054px',
            fontFamily: pageSetup.fontFamily || "'Courier New', Courier, monospace",
            boxSizing: 'border-box',
          }}
        >
          {/* Guías de márgenes de 50mm superior y 40mm inferior */}
          {showGridLines && !previewMode && <MarginGuidelines />}

          {/* 2. LÍNEAS GUÍA DE ALINEACIÓN INTELIGENTE (SMART GUIDES) */}
          {!previewMode && <CanvasGuides />}

          {/* Renderizado de todos los bloques interactivos con react-rnd */}
          {elements.map((el) => (
            <RndBlockWrapper key={el.id} element={el} />
          ))}
        </div>
      </div>
    </div>
  );
};