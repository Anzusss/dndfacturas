/**
 * @file Panel de propiedades del bloque seleccionado.
 *
 * Estructura común (posición/tamaño, título, acciones) + un sub-panel
 * específico según el tipo de bloque (registro TYPE_PROPERTY_PANELS).
 */

import { Sliders } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { ELEMENT_TYPES, ELEMENT_TYPE_LABELS } from '@/domain/constants/elementTypes';
import { SidebarPanel } from '@/presentation/components/common/SidebarPanel';
import { FormField } from '@/presentation/components/common/FormField';
import { PositionSizeControls } from './PositionSizeControls';
import { GridProperties } from './GridProperties';
import { TableProperties } from './TableProperties';
import { TextProperties } from './TextProperties';
import { TotalsProperties } from './TotalsProperties';
import { LineProperties } from './LineProperties';
import { BlockActions } from './BlockActions';

/**
 * Sub-panel específico por tipo de bloque. Todos reciben
 * `{ element, updateElement }`. Los tipos sin entrada solo muestran los
 * controles comunes.
 */
const TYPE_PROPERTY_PANELS = {
  [ELEMENT_TYPES.GRID]: GridProperties,
  [ELEMENT_TYPES.TABLE]: TableProperties,
  [ELEMENT_TYPES.TEXT]: TextProperties,
  [ELEMENT_TYPES.TOTALS]: TotalsProperties,
  [ELEMENT_TYPES.LINE]: LineProperties,
};

/**
 * @param {Object} props
 * @param {Object} props.element Bloque seleccionado.
 */
export const BlockPropertiesPanel = ({ element, collapsible = false, open = true, onToggle }) => {
  const updateElement = useEditorStore((s) => s.updateElement);
  const setSelectedElementId = useEditorStore((s) => s.setSelectedElementId);

  const TypePanel = TYPE_PROPERTY_PANELS[element.type];

  return (
    <SidebarPanel
      title="Propiedades del Bloque"
      subtitle={`Tipo: ${ELEMENT_TYPE_LABELS[element.type] ?? element.type}`}
      icon={Sliders}
      collapsible={collapsible}
      open={open}
      onToggle={onToggle}
      headerAction={
        <button
          type="button"
          onClick={() => setSelectedElementId(null)}
          className="text-[11px] font-medium text-subtle hover:text-neutral-800 transition"
        >
          Cerrar
        </button>
      }
    >
      <PositionSizeControls element={element} updateElement={updateElement} />

      <FormField label="Título del Bloque">
        {(id) => (
          <input
            id={id}
            type="text"
            value={element.title || ''}
            onChange={(e) => updateElement(element.id, { title: e.target.value })}
            className="input-field w-full text-xs"
          />
        )}
      </FormField>

      {TypePanel && <TypePanel element={element} updateElement={updateElement} />}

      <BlockActions elementId={element.id} />
    </SidebarPanel>
  );
};
