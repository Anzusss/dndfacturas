import React, { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { MarginGuidelines } from './canvas/MarginGuidelines';
import { RndBlockWrapper } from './canvas/RndBlockWrapper';
import { CanvasGuides } from './canvas/CanvasGuides';

export const CanvasArea = () => {
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

  const handleDrop = (e) => {
    e.preventDefault();
    if (previewMode) return;

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const data = JSON.parse(rawData);

      const sheetRect = sheetRef.current?.getBoundingClientRect();
      if (!sheetRect) return;

      const rawX = (e.clientX - sheetRect.left) / zoom;
      const rawY = (e.clientY - sheetRect.top) / zoom;

      const elementWidth = data.width || 350;
      const elementHeight = data.height || 120;

      const clampedX = Math.max(10, Math.min(816 - elementWidth - 10, Math.round(rawX)));
      const clampedY = Math.max(10, Math.min(1054 - elementHeight - 10, Math.round(rawY)));

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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div
      /* Fondo gris claro de escritorio */
      className="flex-1 overflow-auto bg-neutral-100 p-8 flex justify-center items-start min-h-0 select-none"
      onClick={() => setSelectedElementId(null)}
    >
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-100 ease-out"
      >
        {/* Hoja física con sombra limpia de papel real */}
        <div
          ref={sheetRef}
          id="invoice-print-sheet"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="print-sheet sheet text-neutral-900 relative overflow-hidden rounded-lg"
          style={{
            width: '816px',
            height: '1054px',
            fontFamily: pageSetup.fontFamily || "'Courier New', Courier, monospace",
            boxSizing: 'border-box',
          }}
        >
          {showGridLines && !previewMode && (
            <MarginGuidelines
              paddingTop={pageSetup.paddingTop}
              paddingBottom={pageSetup.paddingBottom}
            />
          )}
          {!previewMode && <CanvasGuides />}
          {elements.map((el) => (
            <RndBlockWrapper key={el.id} element={el} />
          ))}
        </div>
      </div>
    </div>
  );
};