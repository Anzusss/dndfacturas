import React from 'react';
import { DYNAMICS_VARIABLES } from '@/domain/constants/elementTypes';

/**
 * Mapeo rápido de variables dinámicas indexadas por clave (key).
 * Facilita la búsqueda inmediata de etiquetas legibles y valores de prueba.
 */
const sampleMap = DYNAMICS_VARIABLES.reduce((acc, v) => {
  acc[v.key] = { label: v.label, sample: v.sample };
  return acc;
}, {});

/**
 * Componente GridBlock
 * Renderiza bloques tabulares de pares clave-valor (ej. datos fiscales del cliente
 * o información de control de factura como número, fecha y condición de pago).
 *
 * @param {Object} props
 * @param {Object} props.element - Configuración del bloque (título, campos activos, etc.).
 * @param {boolean} props.previewMode - Indica si está en modo vista previa / impresión.
 */
export const GridBlock = ({ element, previewMode }) => {
  // Detecta si es el bloque de control del documento para ajustar el ancho de las etiquetas
  const isDocInfo = element.fields?.includes('facturaNo');

  return (
    <div className="w-full h-full p-1.5 flex flex-col justify-start text-[12px] text-black">
      {/* Encabezado contextual: siempre en el DOM para preservar el espacio del layout.
          Solo se oculta visualmente en previewMode con visibility:hidden. */}
      <div
        className={`block-editor-label text-[10px] uppercase font-bold border-b border-dashed pb-0.5 mb-1.5 flex justify-between ${
          previewMode
            ? 'invisible border-transparent'
            : 'text-slate-400 border-slate-300'
        }`}
      >
        <span>{element.title}</span>
        <span className="font-mono text-[9px]">GRID</span>
      </div>

      {/* Cuadrícula de 2 columnas: [Etiqueta en negrita, Valor dinámico] */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDocInfo ? '85px 1fr' : '90px 1fr',
          rowGap: '6px',
          columnGap: '8px',
        }}
        className="text-[12px] leading-tight"
      >
        {element.fields?.map((field) => {
          const info = sampleMap[field] || { label: field, sample: `{{${field}}}` };
          return (
            <React.Fragment key={field}>
              {/* Etiqueta fiscal */}
              <div className="font-bold text-black select-none">
                {info.label.includes('Factura') ? 'Factura No.' : `${info.label}:`}
              </div>

              {/* Valor inyectado o simulado de Dynamics */}
              {/* break-words permite que el texto desborde a la siguiente línea */}
              <div className="text-black uppercase break-words">
                {info.sample}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
