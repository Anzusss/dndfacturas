import React from 'react';
import { Rnd } from 'react-rnd';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { useEditorStore } from '@/store/useEditorStore';
import { BlockRenderer } from './blocks/BlockRenderer';
import { FloatingControls } from './blocks/FloatingControls';
import { SelectionHandles } from './blocks/SelectionHandles';
import { useBlockInteractions } from './blocks/hooks/useBlockInteractions';

export const RndBlockWrapper = ({ element }) => {
  const {
    template, selectedElementId, setSelectedElementId, updateElement,
    duplicateElement, removeElement, setGuideLines, zoom, previewMode,
  } = useEditorStore();

  const isSelected = selectedElementId === element.id && !previewMode;
  const isTransparentType = [ELEMENT_TYPES.LINE, 'LINE', ELEMENT_TYPES.TEXT, ELEMENT_TYPES.VARIABLE].includes(element.type);

  const { dragPos, resizeData, handleDrag, handleDragStop, handleResize, handleResizeStop } =
    useBlockInteractions(element, template?.elements || [], zoom, updateElement, setGuideLines);

  const selectElement = (e) => {
    e.stopPropagation();
    if (!previewMode) setSelectedElementId(element.id);
  };

  return (
    <Rnd
      size={{
        width: resizeData ? resizeData.width : (element.width || 350),
        height: resizeData ? resizeData.height : (element.height || 120),
      }}
      position={{
        x: resizeData ? resizeData.x : (dragPos ? dragPos.x : (typeof element.x === 'number' ? element.x : 57)),
        y: resizeData ? resizeData.y : (dragPos ? dragPos.y : (typeof element.y === 'number' ? element.y : 200)),
      }}
      onDragStart={selectElement}
      onResizeStart={selectElement}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      bounds="parent"
      scale={zoom}
      disableDragging={previewMode}
      enableResizing={!previewMode}
      className={`group transition-shadow ${isSelected ? 'z-50' : 'z-10'} ${previewMode
        ? 'border border-transparent'
        : isSelected
          ? `ring-2 ring-primary-500 border border-primary-400 shadow-md ${isTransparentType ? 'bg-transparent' : 'bg-white'}`
          : `border border-dashed border-neutral-300 hover:border-neutral-400 ${isTransparentType ? 'bg-transparent' : 'bg-white/90'}`
        }`}
      style={{ boxSizing: 'border-box' }}
    >
      <div
        className={`w-full h-full relative ${previewMode ? 'cursor-default' : 'cursor-move'}`}
        onClick={selectElement}
      >
        <FloatingControls
          previewMode={previewMode} isSelected={isSelected} element={element}
          resizeData={resizeData} dragPos={dragPos}
          duplicateElement={duplicateElement} removeElement={removeElement}
        />

        <BlockRenderer element={element} previewMode={previewMode} />

        <SelectionHandles isSelected={isSelected} />
      </div>
    </Rnd>
  );
};