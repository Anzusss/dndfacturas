import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { useEditorStore } from '@/store/useEditorStore';
import { BlockRenderer } from './blocks/BlockRenderer';
import { Copy, Trash2, Move } from 'lucide-react';
import { calculateSnap } from '@/utils/snapUtils';

export const RndBlockWrapper = ({ element }) => {
  const {
    template,
    selectedElementId,
    setSelectedElementId,
    updateElement,
    duplicateElement,
    removeElement,
    setGuideLines,
    zoom,
    previewMode,
  } = useEditorStore();

  const elements = template?.elements || [];
  const [dragPos, setDragPos] = useState(null);

  const isSelected = selectedElementId === element.id && !previewMode;

  // 🔴 CAMBIO AQUÍ: Agrupamos los elementos que no deben tener fondo blanco
  const isTransparentType = [
    ELEMENT_TYPES.LINE,
    'LINE',
    ELEMENT_TYPES.TEXT,
    ELEMENT_TYPES.VARIABLE
  ].includes(element.type);

  const renderFloatingControls = () => {
    if (previewMode || !isSelected) return null;
    const currentX = dragPos ? dragPos.x : element.x;
    const currentY = dragPos ? dragPos.y : element.y;

    return (
      <div
        className="no-print absolute -top-8 left-0 z-40 bg-slate-900 border border-slate-700 shadow-2xl rounded-md px-2 py-0.5 flex items-center space-x-2 text-[10px] text-slate-300 pointer-events-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex items-center gap-1 font-mono text-indigo-300 border-r border-slate-700 pr-1.5">
          <Move className="w-3 h-3 text-indigo-400" />
          <span>{Math.round(currentX)},{Math.round(currentY)}</span>
          <span className="text-slate-500 font-sans">|</span>
          <span>{Math.round(element.width)}×{Math.round(element.height)}px</span>
        </span>

        <button
          onClick={() => duplicateElement(element.id)}
          title="Duplicar bloque"
          className="p-1 hover:text-white hover:bg-slate-800 rounded transition"
        >
          <Copy className="w-3 h-3" />
        </button>

        <button
          onClick={() => removeElement(element.id)}
          title="Eliminar bloque"
          className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded transition"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  };

  return (
    <Rnd
      size={{
        width: element.width || 350,
        height: element.height || 120,
      }}
      position={{
        x: dragPos ? dragPos.x : (typeof element.x === 'number' ? element.x : 57),
        y: dragPos ? dragPos.y : (typeof element.y === 'number' ? element.y : 200),
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
      }}
      onDrag={(e, d) => {
        if (e.altKey) {
          setDragPos({ x: d.x, y: d.y });
          if (setGuideLines) setGuideLines({ x: null, y: null });
          return;
        }

        const currentBlock = {
          ...element,
          x: d.x,
          y: d.y,
          width: element.width || 350,
          height: element.height || 120,
        };

        const { snappedX, snappedY, activeGuideX, activeGuideY } = calculateSnap(
          currentBlock,
          elements,
          zoom
        );

        setDragPos({ x: snappedX, y: snappedY });

        if (setGuideLines) {
          setGuideLines({ x: activeGuideX, y: activeGuideY });
        }
      }}
      onDragStop={(e, d) => {
        const finalX = dragPos ? dragPos.x : d.x;
        const finalY = dragPos ? dragPos.y : d.y;
        updateElement(element.id, { x: Math.round(finalX), y: Math.round(finalY) });
        setDragPos(null);
        if (setGuideLines) setGuideLines({ x: null, y: null });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateElement(element.id, {
          width: Math.round(ref.offsetWidth),
          height: Math.round(ref.offsetHeight),
          x: Math.round(position.x),
          y: Math.round(position.y),
        });
      }}
      bounds="parent"
      scale={zoom}
      disableDragging={previewMode}
      enableResizing={!previewMode}
      // 🔴 CAMBIO AQUÍ: Usamos `isTransparentType` en lugar de `isLine`
      className={`group z-10 transition-shadow ${previewMode
        ? 'border border-transparent'
        : isSelected
          ? `ring-2 ring-indigo-500 border border-indigo-400 shadow-md ${isTransparentType ? 'bg-transparent' : 'bg-white'}`
          : `border border-dashed border-slate-300 hover:border-slate-400 ${isTransparentType ? 'bg-transparent' : 'bg-white/90'}`
        }`}
      style={{ boxSizing: 'border-box' }}
    >
      <div
        className={`w-full h-full relative ${previewMode ? 'cursor-default' : 'cursor-move'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!previewMode) setSelectedElementId(element.id);
        }}
      >
        {renderFloatingControls()}
        <BlockRenderer element={element} previewMode={previewMode} />

        {isSelected && (
          <>
            <div className="no-print absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm pointer-events-none" />
          </>
        )}
      </div>
    </Rnd>
  );
};