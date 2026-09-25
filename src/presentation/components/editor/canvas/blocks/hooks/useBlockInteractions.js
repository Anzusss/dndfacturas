// src/presentation/components/editor/canvas/blocks/hooks/useBlockInteractions.js
import { useState } from 'react';
import { calculateSnap, calculateResizeSnap } from '@/utils/snapUtils';

export const useBlockInteractions = (element, elements, zoom, updateElement, setGuideLines) => {
    const [dragPos, setDragPos] = useState(null);
    const [resizeData, setResizeData] = useState(null);

    const handleDrag = (e, d) => {
        if (e.altKey) {
            setDragPos({ x: d.x, y: d.y });
            if (setGuideLines) setGuideLines({ x: null, y: null });
            return;
        }
        const currentBlock = { ...element, x: d.x, y: d.y, width: element.width || 350, height: element.height || 120 };
        const { snappedX, snappedY, activeGuideX, activeGuideY } = calculateSnap(currentBlock, elements, zoom);
        setDragPos({ x: snappedX, y: snappedY });
        if (setGuideLines) setGuideLines({ x: activeGuideX, y: activeGuideY });
    };

    const handleDragStop = (e, d) => {
        const finalX = dragPos ? dragPos.x : d.x;
        const finalY = dragPos ? dragPos.y : d.y;
        updateElement(element.id, { x: Math.round(finalX), y: Math.round(finalY) });
        setDragPos(null);
        if (setGuideLines) setGuideLines({ x: null, y: null });
    };

    const handleResize = (e, direction, ref, delta, position) => {
        if (e.altKey) {
            setResizeData({ width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y });
            if (setGuideLines) setGuideLines({ x: null, y: null });
            return;
        }
        const currentBlock = { ...element, x: position.x, y: position.y, width: ref.offsetWidth, height: ref.offsetHeight };
        const { snappedX, snappedY, snappedWidth, snappedHeight, activeGuideX, activeGuideY } = calculateResizeSnap(currentBlock, elements, direction);
        setResizeData({ width: snappedWidth, height: snappedHeight, x: snappedX, y: snappedY });
        if (setGuideLines) setGuideLines({ x: activeGuideX, y: activeGuideY });
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        const finalWidth = resizeData ? resizeData.width : ref.offsetWidth;
        const finalHeight = resizeData ? resizeData.height : ref.offsetHeight;
        const finalX = resizeData ? resizeData.x : position.x;
        const finalY = resizeData ? resizeData.y : position.y;
        updateElement(element.id, { width: Math.round(finalWidth), height: Math.round(finalHeight), x: Math.round(finalX), y: Math.round(finalY) });
        setResizeData(null);
        if (setGuideLines) setGuideLines({ x: null, y: null });
    };

    return { dragPos, resizeData, handleDrag, handleDragStop, handleResize, handleResizeStop };
};