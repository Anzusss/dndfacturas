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

/**
 * Componente PropertiesSidebar (Barra Lateral Derecha)
 * Orquestador del panel de propiedades.
 * Comportamiento:
 * - Si NO hay elemento seleccionado -> Muestra `PageSetupPanel` (formato y márgenes de hoja).
 * - Si HAY un elemento seleccionado -> Muestra `PositionSizeControls`, el campo de título,
 *   los controles específicos del tipo de bloque y la botonera de acciones (`BlockActions`).
 */
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

  // Localiza el bloque actualmente seleccionado
  const selectedElement = template.elements.find((el) => el.id === selectedElementId);

  // Si no hay elemento activo, despliega la configuración de página
  if (!selectedElement) {
    return <PageSetupPanel template={template} updatePageSetup={updatePageSetup} />;
  }

  return (
    <aside className="no-print w-72 bg-slate-900 border-l border-slate-800 text-slate-200 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Encabezado del bloque seleccionado */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Propiedades del Bloque
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 capitalize">
            Tipo: {selectedElement.type}
          </p>
        </div>
        {/* Botón para deseleccionar y volver a la configuración de página */}
        <button
          onClick={() => setSelectedElementId(null)}
          className="text-[11px] text-slate-400 hover:text-white"
        >
          Cerrar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Control numérico de coordenadas X, Y y dimensiones Ancho, Alto */}
        <PositionSizeControls selectedElement={selectedElement} updateElement={updateElement} />

        {/* Título editable del bloque */}
        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Título del Bloque
          </label>
          <input
            type="text"
            value={selectedElement.title || ''}
            onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Controles condicionales según el tipo de bloque */}
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

        {/* Botones de acción: Duplicar y Eliminar */}
        <BlockActions
          selectedElementId={selectedElement.id}
          duplicateElement={duplicateElement}
          removeElement={removeElement}
        />
      </div>
    </aside>
  );
};
