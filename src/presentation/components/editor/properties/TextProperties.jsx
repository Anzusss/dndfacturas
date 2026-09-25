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
      <label className="text-[11px] font-medium text-muted block mb-1">
        Contenido de Texto
      </label>
      <textarea
        rows={4}
        value={selectedElement.content || ''}
        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
        className="input-field w-full font-mono text-xs leading-relaxed"
      />
    </div>
  );
};
