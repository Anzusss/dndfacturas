import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templateService } from '@/services/templateService';
import { useEditorStore } from '@/store/useEditorStore';
import { Layers, FileCode2, ArrowRight, Plus } from 'lucide-react';

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedJson, setSelectedJson] = useState(null);
  const { setTemplate } = useEditorStore();
  const navigate = useNavigate();

  useEffect(() => {
    templateService.getTemplates().then(setTemplates);
  }, []);

  const handleEdit = (tmpl) => {
    setTemplate(tmpl);
    navigate('/');
  };

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-600" />
              Plantillas de Facturación
            </h1>
            <p className="text-xs text-muted mt-1">
              Formatos registrados listos para desacoplar el diseño de Microsoft Dynamics.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.templateId}
              className="card card-hover p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-heading">{tmpl.name}</h3>
                  <p className="text-[11px] font-mono text-primary-600 mt-0.5">
                    ID: {tmpl.templateId}
                  </p>
                </div>
                <span className="badge badge-primary">
                  {tmpl.pageSetup.size} ({tmpl.pageSetup.width} × {tmpl.pageSetup.minHeight})
                </span>
              </div>

              <div className="text-xs text-muted space-y-1">
                <p>• Margen Superior: <span className="font-mono text-neutral-700">{tmpl.pageSetup.paddingTop}</span></p>
                <p>• Margen Inferior: <span className="font-mono text-neutral-700">{tmpl.pageSetup.paddingBottom}</span></p>
                <p>• Elementos configurados: <span className="font-mono text-neutral-700">{tmpl.elements.length}</span></p>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedJson(tmpl)}
                  className="text-xs text-muted hover:text-primary-600 flex items-center gap-1 transition"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Ver JSON Schema</span>
                </button>

                <button
                  onClick={() => handleEdit(tmpl)}
                  className="btn-secondary text-xs"
                >
                  <span>Abrir en Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Visor de JSON Schema */}
        {selectedJson && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-primary-600" />
                  JSON Schema: {selectedJson.templateId}
                </h3>
                <button
                  onClick={() => setSelectedJson(null)}
                  className="text-xs text-muted hover:text-neutral-900 transition"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <pre className="font-mono text-[11px] bg-neutral-50 p-4 rounded-lg text-neutral-900 border border-neutral-200 overflow-x-auto">
                  {JSON.stringify(selectedJson, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
