/**
 * @file Campo numérico con etiqueta y unidad opcional ("mm", "px").
 *
 * Sustituye a los 6 inputs numéricos casi idénticos que había entre
 * PositionSizeControls y PageSetupPanel.
 */

import { FormField } from './FormField';

/**
 * @param {Object}   props
 * @param {string}   props.label
 * @param {number}   props.value
 * @param {(value:number|null) => void} props.onChange
 *   Recibe el número introducido o `null` si el campo quedó vacío / no es válido.
 *   Cada consumidor decide qué valor usar en ese caso.
 * @param {number}  [props.min]
 * @param {number}  [props.max]
 * @param {number}  [props.step=1]
 * @param {string}  [props.unit]  Sufijo mostrado dentro del campo.
 * @param {boolean} [props.disabled]
 */
export const NumberField = ({ label, value, onChange, min, max, step = 1, unit, disabled = false }) => {
  const handleChange = (event) => {
    const parsed = parseInt(event.target.value, 10);
    onChange(Number.isNaN(parsed) ? null : parsed);
  };

  return (
    <FormField label={label} size="sm">
      {(id) => (
        <div className="relative">
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className={`input-field w-full font-mono text-xs disabled:bg-neutral-100 disabled:text-neutral-500 ${unit ? 'pr-7' : ''}`}
          />
          {unit && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-subtle font-mono pointer-events-none">
              {unit}
            </span>
          )}
        </div>
      )}
    </FormField>
  );
};
