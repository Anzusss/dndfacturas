/**
 * @file Envoltorio de campo de formulario: etiqueta + control.
 *
 * Unifica el patrón `<label className="text-[11px] ...">` que se repetía en
 * todos los paneles de propiedades.
 */

import { useId } from 'react';

/**
 * @param {Object} props
 * @param {string} props.label      Texto de la etiqueta.
 * @param {'sm'|'md'} [props.size]  Tamaño de la etiqueta (sm = 10px, md = 11px).
 * @param {(id:string) => import('react').ReactNode} props.children
 *   Función que recibe el `id` a asignar al control, para que la etiqueta
 *   quede asociada (accesibilidad: clic en la etiqueta enfoca el campo).
 */
export const FormField = ({ label, size = 'md', children }) => {
  const id = useId();
  const labelSize = size === 'sm' ? 'text-[10px]' : 'text-[11px] font-medium';

  return (
    <div>
      <label htmlFor={id} className={`${labelSize} text-muted block mb-1`}>
        {label}
      </label>
      {children(id)}
    </div>
  );
};
