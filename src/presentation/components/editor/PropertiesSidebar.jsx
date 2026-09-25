import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { PageSetupPanel } from './properties/PageSetupPanel';
import { PositionSizeControls } from './properties/PositionSizeControls';
import { GridProperties } from './properties/GridProperties';
import { TableProperties } from './properties/TableProperties';
import { TextProperties } from './properties/TextProperties';
import { TotalsProperties } from './properties/TotalsProperties';
import { BlockActions } from './properties/BlockActions';
import { Sliders } from 'lucide-react';

export const PropertiesSidebar = () => {
  const {
    template,
    selectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    updatePageSetup,
    setSelectedElementId,
  } = useEditorStore();

  const selectedElement = template.elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return <PageSetupPanel template={template} updatePageSetup={updatePageSetup} />;
  }

  return (
    <aside className="no-print w-72 bg-white border-l border-neutral-200 text-neutral-800 flex flex-col h-[calc(100vh-3.5rem)] select-none shadow-sm">
      {/* Encabezado */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-primary-600" />
            Propiedades del Bloque
          </h2>
          <p className="text-[11px] text-subtle mt-0.5 capitalize">
            Tipo: {selectedElement.type}
          </p>
        </div>
        <button
          onClick={() => setSelectedElementId(null)}
          className="text-[11px] font-medium text-subtle hover:text-neutral-800 transition"
        >
          Cerrar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        <PositionSizeControls selectedElement={selectedElement} updateElement={updateElement} />

        <div>
          <label className="text-[11px] font-medium text-muted block mb-1">
            Título del Bloque
          </label>
          <input
            type="text"
            value={selectedElement.title || ''}
            onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })}
            className="input-field w-full text-xs"
          />
        </div>

        {selectedElement.type === ELEMENT_TYPES.GRID && (
          <GridProperties selectedElement={selectedElement} updateElement={updateElement} />
        )}

        {selectedElement.type === ELEMENT_TYPES.TABLE && (
          <TableProperties selectedElement={selectedElement} updateElement={updateElement} />
        )}

        {selectedElement.type === ELEMENT_TYPES.TEXT && (
          <TextProperties selectedElement={selectedElement} updateElement={updateElement} />
        )}

        {selectedElement.type === ELEMENT_TYPES.TOTALS && (
          <TotalsProperties selectedElement={selectedElement} />
        )}

        <BlockActions
          selectedElementId={selectedElement.id}
          duplicateElement={duplicateElement}
          removeElement={removeElement}
        />
      </div>
    </aside>
  );
};