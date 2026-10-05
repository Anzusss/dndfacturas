/**
 * @file Página del editor visual (ruta "/").
 * Layout: cabecera + barra de estado + 3 columnas (Toolbox | Lienzo | Propiedades).
 */

import { useEditorStore } from '@/store/useEditorStore';
import { templateWorkflowService } from '@/services/templateWorkflowService';
import { useToast } from '@/presentation/hooks/useToast';
import { useCurrentUser } from '@/presentation/hooks/useCurrentUser';
import { Toast } from '@/presentation/components/common/Toast';
import { EditorHeader } from '../components/editor/EditorHeader';
import { TemplateStatusBar } from '../components/editor/header/TemplateStatusBar';
import { ToolboxSidebar } from '../components/editor/ToolboxSidebar';
import { CanvasArea } from '../components/editor/CanvasArea';
import { PropertiesSidebar } from '../components/editor/PropertiesSidebar';
import { useState } from 'react';

export const EditorPage = () => {
  const { toast, showToast } = useToast();
  const user = useCurrentUser();
  const [openPanel, setOpenPanel] = useState('toolbox');

  const togglePanel = (panel) => setOpenPanel((current) => (current === panel ? null : panel));

  /**
   * Guarda el borrador actual. Se lee del store en el momento del clic para
   * no suscribir la página entera a cada cambio de la plantilla.
   */
  const handleSave = async () => {
    try {
      await templateWorkflowService.saveDraft(useEditorStore.getState().template, user);
      showToast('Borrador guardado con éxito.');
    } catch (error) {
      showToast(error.message || 'No se pudo guardar la plantilla.', 'error');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-50">
      <EditorHeader onSave={handleSave} />
      <TemplateStatusBar onNotify={showToast} />

      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <div className="no-print flex w-72 shrink-0 flex-col min-h-0 border-r border-neutral-200 bg-white">
          <ToolboxSidebar
            collapsible
            open={openPanel === 'toolbox'}
            onToggle={() => togglePanel('toolbox')}
          />
          <PropertiesSidebar
            collapsible
            open={openPanel === 'properties'}
            onToggle={() => togglePanel('properties')}
          />
        </div>
        <CanvasArea />
      </div>

      <Toast toast={toast} />
    </div>
  );
};
