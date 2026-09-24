import React from 'react';

/**
 * Componente TextProperties
 * Proporciona un área de texto (textarea) para redactar o editar el contenido
 * de advertencias fiscales, leyendas del IGTF o condiciones de pago.
 *
 * @param {Object} props
 * @param {Object} props.selectedElement - Elemento tipo TEXT seleccionado.
 * @param {Function} props.updateElement - Función para actualizar la propiedad `content`.
 */
export const TextProperties = ({ selectedElement, updateElement }) => {
  return (
    <div>
      <label className="text-[11px] font-medium text-slate-400 block mb-1">
        Contenido de Texto
      </label>
      <textarea
        rows={4}
        value={selectedElement.content || ''}
        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
        className="w-full bg-slate-950 border border-slate-700/80 rounded p-2 text-slate-200 font-mono text-xs focus:border-indigo-500 outline-none leading-relaxed"
      />
    </div>
  );
};
