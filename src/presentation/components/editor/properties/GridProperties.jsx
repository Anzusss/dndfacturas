import React from 'react';
import { DYNAMICS_VARIABLES } from '@/domain/constants/elementTypes';
import { CheckSquare, Square } from 'lucide-react';

/**
 * Componente GridProperties
 * Permite seleccionar interactivamente cuáles variables del ERP Microsoft Dynamics
 * estarán visibles dentro del bloque Grid seleccionado mediante casillas de verificación.
 *
 * @param {Object} props
 * @param {Object} props.selectedElement - Elemento tipo GRID seleccionado.
 * @param {Function} props.updateElement - Función para actualizar el arreglo `fields`.
 */
export const GridProperties = ({ selectedElement, updateElement }) => {
  /**
   * Conmuta la visibilidad de un campo (agrega si no existe, o remueve si ya estaba seleccionado).
   */
  const toggleGridField = (fieldKey) => {
    const currentFields = selectedElement.fields || [];
    const exists = currentFields.includes(fieldKey);
    const updated = exists
      ? currentFields.filter((f) => f !== fieldKey)
      : [...currentFields, fieldKey];
    updateElement(selectedElement.id, { fields: updated });
  };

  return (
    <div className="space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <span className="text-[11px] font-semibold text-neutral-700 block mb-1">
        Campos Dinámicos a Mostrar
      </span>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {DYNAMICS_VARIABLES.map((v) => {
          const isChecked = selectedElement.fields?.includes(v.key);
          return (
            <button
              key={v.key}
              onClick={() => toggleGridField(v.key)}
              className="w-full flex items-center justify-between text-left text-[11px] text-neutral-600 hover:text-neutral-900 py-0.5"
            >
              <span className="truncate">{v.label}</span>
              {isChecked ? (
                <CheckSquare className="w-3.5 h-3.5 text-primary-500 shrink-0 ml-1" />
              ) : (
                <Square className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
