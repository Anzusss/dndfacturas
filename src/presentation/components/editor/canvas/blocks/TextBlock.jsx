import React from 'react';

export const TextBlock = ({ element, previewMode }) => {
  return (
    // Se reemplaza leading-tight por leading-none para eliminar el margen interno de la fuente
    <div className="w-full h-full flex flex-col justify-start text-[12px] leading-none text-black">
      <div className="whitespace-pre-wrap">
        {element.content}
      </div>
    </div>
  );
};