import React, { useState } from 'react';
import { EditorHeader } from '../components/editor/EditorHeader';
import { ToolboxSidebar } from '../components/editor/ToolboxSidebar';
import { CanvasArea } from '../components/editor/CanvasArea';
import { PropertiesSidebar } from '../components/editor/PropertiesSidebar';
import { useEditorStore } from '@/store/useEditorStore';
import { templateService } from '@/services/templateService';
import { auditService } from '@/services/auditService';
import { CheckCircle2 } from 'lucide-react';

export const EditorPage = () => {
  const { template } = useEditorStore();
  const [toastMessage, setToastMessage] = useState(null);

  const handleSave = async () => {
    await templateService.saveTemplate(template);
    showToast('Plantilla guardada con éxito.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {/* Header específico del lienzo */}
      <EditorHeader onSave={handleSave} />

      {/* Layout de 3 columnas para el lienzo "Canva" */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <ToolboxSidebar />
        <CanvasArea />
        <PropertiesSidebar />
      </div>

      {/* Notificación Toast */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fade-in z-50">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
