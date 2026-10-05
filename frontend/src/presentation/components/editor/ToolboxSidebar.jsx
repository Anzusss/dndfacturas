/**
 * @file Barra lateral izquierda: catálogo de bloques y campos del ERP que se
 * pueden arrastrar a la hoja o insertar con un clic.
 */

import { useState } from 'react';
import { Layers, Braces, Info, Lock } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { selectIsEditable } from '@/store/editorSelectors';
import { DYNAMICS_VARIABLES } from '@/domain/constants/dynamicsVariables';
import { SidebarPanel } from '@/presentation/components/common/SidebarPanel';
import { TOOLBOX_CATEGORIES, TOOLBOX_ITEMS } from './toolbox/config/toolboxCatalog';
import { ToolboxCategoryTabs } from './toolbox/ToolboxCategoryTabs';
import { ToolboxItem } from './toolbox/ToolboxItem';
import { ToolboxVariableItem } from './toolbox/ToolboxVariableItem';

export const ToolboxSidebar = ({ collapsible = false, open = true, onToggle }) => {
  // `addElement` completa id y posición, así que se pasa directamente como callback de inserción.
  const addElement = useEditorStore((s) => s.addElement);
  const editable = useEditorStore(selectIsEditable);
  const [activeTab, setActiveTab] = useState('all');

  const visibleItems =
    activeTab === 'all' ? TOOLBOX_ITEMS : TOOLBOX_ITEMS.filter((item) => item.category === activeTab);
  const showErpVariables = activeTab === 'all' || activeTab === 'erp';

  return (
    <SidebarPanel
      side="left"
      collapsible={collapsible}
      open={open}
      onToggle={onToggle}
      title="Componentes Visuales"
      subtitle="Arrastra hacia la hoja o haz clic para insertar"
      icon={Layers}
      headerExtra={
        <ToolboxCategoryTabs categories={TOOLBOX_CATEGORIES} activeTab={activeTab} onSelectTab={setActiveTab} />
      }
      bodyClassName="p-3 space-y-4"
    >
      {/* Plantilla en revisión o aprobada: no se pueden insertar bloques. */}
      {!editable && (
        <div className="p-2.5 rounded-lg bg-warning-50 border border-warning-100 text-[11px] text-warning-600 flex items-start gap-2">
          <Lock className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Esta versión no se puede editar. Crea una nueva versión desde la barra superior.</span>
        </div>
      )}

      {/* Estructuras y formas */}
      {editable && visibleItems.length > 0 && (
        <div className="space-y-1.5">
          {visibleItems.map((item) => (
            <ToolboxItem key={item.title} {...item} onInsert={addElement} />
          ))}
        </div>
      )}

      {/* Variables sueltas del ERP */}
      {editable && showErpVariables && (
        <div>
          <div className="flex items-center justify-between my-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
              Campos de Dynamics ERP
            </span>
            <Braces className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <div className="space-y-1">
            {DYNAMICS_VARIABLES.map((variable) => (
              <ToolboxVariableItem key={variable.key} variable={variable} onInsert={addElement} />
            ))}
          </div>
        </div>
      )}

      <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-muted flex items-start gap-2">
        <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
        <span>Arrastra cualquier elemento al lienzo para posicionarlo libremente.</span>
      </div>
    </SidebarPanel>
  );
};
