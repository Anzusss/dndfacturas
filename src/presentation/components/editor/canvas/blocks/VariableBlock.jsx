import React from 'react';

/**
 * Componente VariableBlock
 * Renderiza una variable individual independiente insertada desde el catálogo de Dynamics.
 * Útil para ubicar campos sueltos en coordenadas libres de la factura
 * (por ejemplo, número de control, sello de agua o etiquetas flotantes).
 *
 * @param {Object} props
 * @param {Object} props.element - Datos de la variable (clave ERP, valor de muestra, título).
 */
export const VariableBlock = ({ element }) => {
  return (
    <div className="w-full h-full p-1.5 flex items-center justify-between text-xs bg-purple-50/50 text-black">
      <span className="font-bold text-purple-900">{element.title}:</span>
      {/* break-words evita que valores largos queden cortados con "..." */}
      <span className="font-mono text-purple-800 ml-1 break-words">
        {element.sampleValue || `{{${element.variableKey}}}`}
      </span>
    </div>
  );
};
