/**
 * @file Grosor y color de un bloque de línea.
 * LineBlock ya soportaba `thickness` y `color`, pero no había forma de
 * editarlos desde la interfaz.
 */

import { LINE_DEFAULTS } from '@/domain/models/elementFactory';
import { FormField } from '@/presentation/components/common/FormField';
import { NumberField } from '@/presentation/components/common/NumberField';
import { PropertySection } from './PropertySection';

/** Rango de grosor permitido, en px. */
const THICKNESS_LIMITS = { MIN: 1, MAX: 10 };

/**
 * @param {Object}   props
 * @param {Object}   props.element       Bloque de tipo LINE.
 * @param {Function} props.updateElement Acción del store `(id, cambios) => void`.
 */
export const LineProperties = ({ element, updateElement }) => {
  /** Limita el grosor al rango permitido (campo vacío → mínimo). */
  const handleThickness = (value) => {
    const thickness = Math.min(THICKNESS_LIMITS.MAX, Math.max(THICKNESS_LIMITS.MIN, value ?? THICKNESS_LIMITS.MIN));
    updateElement(element.id, { thickness });
  };

  return (
    <PropertySection title="Estilo de Línea">
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Grosor"
          unit="px"
          min={THICKNESS_LIMITS.MIN}
          max={THICKNESS_LIMITS.MAX}
          value={element.thickness ?? LINE_DEFAULTS.thickness}
          onChange={handleThickness}
        />
        <FormField label="Color" size="sm">
          {(id) => (
            <input
              id={id}
              type="color"
              value={element.color ?? LINE_DEFAULTS.color}
              onChange={(e) => updateElement(element.id, { color: e.target.value })}
              className="input-field w-full h-[30px] p-0.5 cursor-pointer"
            />
          )}
        </FormField>
      </div>
    </PropertySection>
  );
};
