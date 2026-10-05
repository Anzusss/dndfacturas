/**
 * @file Ajuste numérico de posición (X, Y) y tamaño (ancho, alto) en px.
 * Sincronizado en ambos sentidos con el arrastre/redimensión de react-rnd,
 * ya que ambos leen y escriben el mismo bloque del store.
 */

import { Move } from 'lucide-react';
import { NumberField } from '@/presentation/components/common/NumberField';
import { PropertySection } from './PropertySection';

/**
 * Campos editables agrupados por fila. `fallback` es el valor que se aplica
 * cuando el campo queda vacío (un tamaño 0 haría invisible el bloque).
 */
const FIELD_ROWS = [
  [
    { key: 'x', label: 'X (Horizontal)', fallback: 0 },
    { key: 'y', label: 'Y (Vertical)', fallback: 0 },
  ],
  [
    { key: 'width', label: 'Ancho (Width)', fallback: 50 },
    { key: 'height', label: 'Alto (Height)', fallback: 30 },
  ],
];

/**
 * @param {Object}   props
 * @param {Object}   props.element       Bloque seleccionado.
 * @param {Function} props.updateElement Acción del store `(id, cambios) => void`.
 */
export const PositionSizeControls = ({ element, updateElement }) => (
  <PropertySection title="Posición y Dimensiones (px)" icon={Move}>
    {FIELD_ROWS.map((row, rowIndex) => (
      <div
        key={rowIndex}
        className={`grid grid-cols-2 gap-2 ${rowIndex > 0 ? 'pt-2 border-t border-neutral-200' : ''}`}
      >
        {row.map(({ key, label, fallback }) => (
          <NumberField
            key={key}
            label={label}
            value={Math.round(element[key] || 0)}
            onChange={(value) => updateElement(element.id, { [key]: value ?? fallback })}
          />
        ))}
      </div>
    ))}
  </PropertySection>
);
