/**
 * @file Bloque de texto libre (leyendas legales, notas, condiciones).
 * Admite variables con la sintaxis `{{campo}}` (p. ej. `Tasa: {{tasaCambio}}`)
 * y respeta los saltos de línea (`whitespace-pre-wrap`).
 */

import { renderText } from '../bindings';

/**
 * @param {Object} props
 * @param {Object} props.element
 * @param {string} props.element.content Texto con posibles `{{variables}}`.
 * @param {Object} props.data            Datos de la factura.
 * @param {boolean} props.previewMode    Impresión/vista previa: las variables sin dato quedan en blanco.
 */
export const TextBlock = ({ element, data, previewMode }) => (
  // leading-none elimina el interlineado extra de la fuente para ajustar al milímetro.
  <div className="w-full h-full flex flex-col justify-start text-[12px] leading-none text-black">
    <div className="whitespace-pre-wrap">{renderText(element.content, data, !previewMode)}</div>
  </div>
);
