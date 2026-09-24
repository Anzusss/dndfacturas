import React from 'react';

/**
 * Componente TableBlock
 * Renderiza la tabla de renglones/ítems de la factura.
 * Respeta el formato fiscal estricto:
 * - Bordes superior e inferior sólidos de 1px en el encabezado.
 * - Alineación izquierda para columnas de texto (Cantidad, UM, Descripción).
 * - Alineación derecha para columnas numéricas y monetarias (Precios, Subtotales).
 *
 * @param {Object} props
 * @param {Object} props.element - Configuración de la tabla (columnas, renglones de prueba).
 * @param {boolean} props.previewMode - Bandera para ocultar metadatos en vista previa.
 */
export const TableBlock = ({ element, previewMode }) => {
  return (
    <div className="w-full h-full p-1 flex flex-col text-[12px] text-black">
      {/* Etiqueta de edición visual: siempre en DOM para estabilizar el layout */}
      <div
        className={`block-editor-label text-[10px] uppercase font-bold border-b border-dashed pb-0.5 mb-1 flex justify-between ${
          previewMode
            ? 'invisible border-transparent'
            : 'text-slate-400 border-slate-300'
        }`}
      >
        <span>{element.title}</span>
        <span className="font-mono text-[9px]">TABLA</span>
      </div>

      {/* Tabla HTML estandarizada */}
      <table className="w-full border-collapse text-[12px] leading-tight">
        <thead>
          <tr className="border-t border-b border-black font-bold text-black">
            {element.columns?.map((col, cIdx) => (
              <th
                key={cIdx}
                className={`py-2 px-1 font-bold ${
                  // Las primeras 3 columnas son descriptivas (izq), el resto importes monetarios (der)
                  cIdx < 3 ? 'text-left' : 'text-right'
                  }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {element.sampleRows?.map((row, rIdx) => (
            <tr key={rIdx} className="text-black">
              <td className="py-2 px-1 text-left">{row.cant}</td>
              <td className="py-2 px-1 text-left">{row.um}</td>
              <td className="py-2 px-1 text-left">{row.desc}</td>
              <td className="py-2 px-1 text-right">{row.precio}</td>
              <td className="py-2 px-1 text-right">{row.subUsd}</td>
              <td className="py-2 px-1 text-right font-medium">{row.subBs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
