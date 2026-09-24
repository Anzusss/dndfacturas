import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export const CanvasGuides = () => {
    const { guideLines } = useEditorStore();

    if (!guideLines) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 no-print">
            {/* Línea Guía Vertical (Eje X) */}
            {guideLines.x !== null && (
                <div
                    className="absolute top-0 bottom-0 border-l border-dashed border-red-500"
                    style={{ left: `${guideLines.x}px` }}
                >
                    <span className="absolute top-2 left-1 bg-red-500 text-white text-[9px] px-1 rounded font-mono">
                        {Math.round(guideLines.x)}px
                    </span>
                </div>
            )}

            {/* Línea Guía Horizontal (Eje Y) */}
            {guideLines.y !== null && (
                <div
                    className="absolute left-0 right-0 border-t border-dashed border-red-500"
                    style={{ top: `${guideLines.y}px` }}
                >
                    <span className="absolute left-2 top-1 bg-red-500 text-white text-[9px] px-1 rounded font-mono">
                        {Math.round(guideLines.y)}px
                    </span>
                </div>
            )}
        </div>
    );
};