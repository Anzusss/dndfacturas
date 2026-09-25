// src/presentation/components/editor/canvas/blocks/FloatingControls.jsx
import React from 'react';
import { Copy, Trash2, Move } from 'lucide-react';

export const FloatingControls = ({
    previewMode,
    isSelected,
    element,
    resizeData,
    dragPos,
    duplicateElement,
    removeElement
}) => {
    if (previewMode || !isSelected) return null;

    const currentX = resizeData ? resizeData.x : (dragPos ? dragPos.x : element.x);
    const currentY = resizeData ? resizeData.y : (dragPos ? dragPos.y : element.y);
    const currentWidth = resizeData ? resizeData.width : (element.width || 350);
    const currentHeight = resizeData ? resizeData.height : (element.height || 120);

    return (
        <div
            className="no-print absolute -top-8 left-0 z-40 bg-white border border-neutral-200 shadow-lg rounded-md px-2 py-0.5 flex items-center space-x-2 text-[10px] text-neutral-700 pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="flex items-center gap-1 font-mono text-primary-600 border-r border-neutral-200 pr-1.5">
                <Move className="w-3 h-3 text-primary-500" />
                <span>{Math.round(currentX)},{Math.round(currentY)}</span>
                <span className="text-neutral-400 font-sans">|</span>
                <span>{Math.round(currentWidth)}×{Math.round(currentHeight)}px</span>
            </span>

            <button
                onClick={() => duplicateElement(element.id)}
                title="Duplicar bloque"
                className="p-1 hover:text-neutral-900 hover:bg-neutral-100 rounded transition"
            >
                <Copy className="w-3 h-3" />
            </button>

            <button
                onClick={() => removeElement(element.id)}
                title="Eliminar bloque"
                className="p-1 text-error-500 hover:text-error-600 hover:bg-error-50 rounded transition"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
    );
};