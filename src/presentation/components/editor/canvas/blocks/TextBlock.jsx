import React from 'react';

export const TextBlock = ({ element, previewMode }) => {
  return (
    // 🔴 CAMBIO AQUÍ: Agregamos `overflow-hidden` al final de las clases
    <div className="w-full h-full p-2 flex flex-col justify-start text-[12px] leading-[16px] text-black overflow-hidden">

      <div
        className={`block-editor-label text-[10px] uppercase font-bold border-b border-dashed pb-0.5 mb-1.5 flex justify-between ${previewMode
          ? 'invisible border-transparent'
          : 'text-slate-400 border-slate-300'
          }`}
      >
        <span>{element.title}</span>
        <span className="font-mono text-[9px]">TEXTO / LEGAL</span>
      </div>

      <div className="whitespace-pre-wrap">
        {element.content}
      </div>
    </div>
  );
};