// src/presentation/components/editor/canvas/blocks/LineBlock.jsx
import React from 'react';

export const LineBlock = ({ element }) => {
    return (
        // w-full h-full ocupa toda el área de la caja de Rnd (que tiene la altura que el usuario configuró)
        <div className="w-full h-full relative pointer-events-none flex items-center">
            <div
                className="w-full absolute"
                style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderTopWidth: `${element.thickness || 1}px`,
                    borderTopStyle: 'solid',
                    borderTopColor: element.color || '#000000',
                }}
            />
        </div>
    );
};