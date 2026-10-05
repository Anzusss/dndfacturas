/**
 * @file Selección de los campos del ERP visibles en un bloque Grid.
 */

import { CheckSquare, Square } from 'lucide-react';
import { DYNAMICS_VARIABLES } from '@/domain/constants/dynamicsVariables';
import { PropertySection } from './PropertySection';

/**
 * @param {Object}   props
 * @param {Object}   props.element       Bloque de tipo GRID.
 * @param {Function} props.updateElement Acción del store `(id, cambios) => void`.
 */
export const GridProperties = ({ element, updateElement }) => {
  const fields = element.fields ?? [];

  /** Agrega el campo si no estaba o lo quita si ya estaba (conserva el orden). */
  const toggleField = (fieldKey) => {
    const updated = fields.includes(fieldKey)
      ? fields.filter((f) => f !== fieldKey)
      : [...fields, fieldKey];
    updateElement(element.id, { fields: updated });
  };

  return (
    <PropertySection title="Campos Dinámicos a Mostrar">
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {DYNAMICS_VARIABLES.map((variable) => {
          const isChecked = fields.includes(variable.key);
          const Icon = isChecked ? CheckSquare : Square;

          return (
            <button
              key={variable.key}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              onClick={() => toggleField(variable.key)}
              className="w-full flex items-center justify-between text-left text-[11px] text-neutral-600 hover:text-neutral-900 py-0.5"
            >
              <span className="truncate">{variable.label}</span>
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ml-1 ${isChecked ? 'text-primary-500' : 'text-neutral-400'}`}
              />
            </button>
          );
        })}
      </div>
    </PropertySection>
  );
};
