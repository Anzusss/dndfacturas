/**
 * @file Variable suelta de la factura colocada libremente en la hoja
 * (p. ej. número de control o una etiqueta flotante).
 *
 * En modo edición se resalta en azul para distinguirla del texto fijo.
 * En vista previa/impresión se pinta en negro y sin fondo, para que el tinte
 * no salga impreso en el papel fiscal (`print-color-adjust: exact`).
 */

import { displayField } from '../bindings';

/**
 * @param {Object}  props
 * @param {Object}  props.element
 * @param {string}  props.element.title       Etiqueta visible.
 * @param {string}  props.element.variableKey Campo de la factura.
 * @param {Object}  props.data                Datos de la factura.
 * @param {boolean} props.previewMode
 */
export const VariableBlock = ({ element, data, previewMode }) => {
  const styles = previewMode
    ? { container: '', label: '', value: '' }
    : { container: 'bg-primary-50/50', label: 'text-primary-900', value: 'text-primary-800' };

  return (
    <div className={`w-full h-full p-1.5 flex items-center justify-between text-xs text-black ${styles.container}`}>
      <span className={`font-bold ${styles.label}`}>{element.title}:</span>
      {/* break-words evita que valores largos queden cortados. */}
      <span className={`font-mono ml-1 break-words ${styles.value}`}>
        {displayField(data, element.variableKey)}
      </span>
    </div>
  );
};
