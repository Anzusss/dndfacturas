// src/presentation/components/editor/canvas/blocks/SelectionHandles.jsx
import React from 'react';

export const SelectionHandles = ({ isSelected }) => {
    if (!isSelected) return null;

    return (
        <>
            <div className="no-print absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm pointer-events-none" />
            <div className="no-print absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm pointer-events-none" />
        </>
    );
};