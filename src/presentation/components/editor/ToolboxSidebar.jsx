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
    <aside className="no-print w-72 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Encabezado y Categorías */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Componentes Visuales
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Arrastra hacia la hoja o haz clic para insertar
          </p>
        </div>

        <ToolboxCategoryTabs
          categories={TOOLBOX_CATEGORIES}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>

      {/* Lista de Contenidos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Renderizado de Estructuras y Figuras */}
        {visibleItems.length > 0 && (
          <div className="space-y-1.5">
            {visibleItems.map((item, idx) => (
              <ToolboxItem key={idx} {...item} onInsert={handleInsert} />
            ))}
          </div>
        )}

        {/* Renderizado de Variables ERP */}
        {showErpVariables && (
          <div>
            <div className="flex items-center justify-between my-2 px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                Campos de Dynamics ERP
              </span>
              <Braces className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="space-y-1">
              {DYNAMICS_VARIABLES.map((v) => (
                <ToolboxVariableItem key={v.key} variable={v} onInsert={handleInsert} />
              ))}
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>Arrastra cualquier elemento al lienzo para posicionarlo libremente.</span>
        </div>
      </div>
    </aside>
  );
};