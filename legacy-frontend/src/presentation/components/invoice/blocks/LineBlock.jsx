/**
 * @file Línea horizontal separadora. Se dibuja centrada verticalmente dentro
 * de la caja del bloque, de modo que la caja puede ser más alta que la línea
 * (más fácil de agarrar con el ratón).
 */

import { LINE_DEFAULTS } from '@/domain/models/elementFactory';

/**
 * @param {Object}  props
 * @param {Object}  props.element
 * @param {number} [props.element.thickness] Grosor en px.
 * @param {string} [props.element.color]     Color CSS.
 */
export const LineBlock = ({ element }) => (
  <div className="w-full h-full relative pointer-events-none flex items-center">
    <div
      className="w-full absolute top-1/2 -translate-y-1/2"
      style={{
        borderTopWidth: `${element.thickness ?? LINE_DEFAULTS.thickness}px`,
        borderTopStyle: 'solid',
        borderTopColor: element.color ?? LINE_DEFAULTS.color,
      }}
    />
  </div>
);
