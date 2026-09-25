import React, { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { DYNAMICS_VARIABLES } from '@/domain/constants/elementTypes';

import { TOOLBOX_CATEGORIES, TOOLBOX_ITEMS } from './toolbox/config/toolboxCatalog';
import { ToolboxCategoryTabs } from './toolbox/ToolboxCategoryTabs';
import { ToolboxItem } from './toolbox/ToolboxItem';
import { ToolboxVariableItem } from './toolbox/ToolboxVariableItem';

import { Layers, Braces, Info } from 'lucide-react';

export const ToolboxSidebar = () => {
  const { addElement } = useEditorStore();
  const [activeTab, setActiveTab] = useState('all');

  const handleInsert = (data) => {
    addElement({
      ...data,
      id: `${data.type}-${Date.now()}`,
    });
  };

  const visibleItems = activeTab === 'all'
    ? TOOLBOX_ITEMS
    : TOOLBOX_ITEMS.filter((item) => item.category === activeTab);

  const showErpVariables = activeTab === 'all' || activeTab === 'erp';

  return (
    <aside className="no-print w-72 bg-white border-r border-neutral-200 text-neutral-800 flex flex-col h-[calc(100vh-3.5rem)] select-none shadow-sm">
      {/* Encabezado */}
      <div className="p-4 border-b border-neutral-100 space-y-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary-600" />
            Componentes Visuales
          </h2>
          <p className="text-[11px] text-subtle mt-0.5">
            Arrastra hacia la hoja o haz clic para insertar
          </p>
        </div>

        <ToolboxCategoryTabs
          categories={TOOLBOX_CATEGORIES}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* Contenidos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {visibleItems.length > 0 && (
          <div className="space-y-1.5">
            {visibleItems.map((item, idx) => (
              <ToolboxItem key={idx} {...item} onInsert={handleInsert} />
            ))}
          </div>
        )}

        {showErpVariables && (
          <div>
            <div className="flex items-center justify-between my-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                Campos de Dynamics ERP
              </span>
              <Braces className="w-3.5 h-3.5 text-primary-600" />
            </div>
            <div className="space-y-1">
              {DYNAMICS_VARIABLES.map((v) => (
                <ToolboxVariableItem key={v.key} variable={v} onInsert={handleInsert} />
              ))}
            </div>
          </div>
        )}

        <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-muted flex items-start gap-2">
          <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
          <span>Arrastra cualquier elemento al lienzo para posicionarlo libremente.</span>
        </div>
      </div>
    </aside>
  );
};