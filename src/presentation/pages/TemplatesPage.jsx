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
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Plantillas de Facturación
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Formatos registrados listos para desacoplar el diseño de Microsoft Dynamics.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <div
              key={tmpl.templateId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{tmpl.name}</h3>
                  <p className="text-[11px] font-mono text-indigo-400 mt-0.5">
                    ID: {tmpl.templateId}
                  </p>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {tmpl.pageSetup.size} ({tmpl.pageSetup.width} × {tmpl.pageSetup.minHeight})
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>• Margen Superior: <span className="font-mono text-slate-300">{tmpl.pageSetup.paddingTop}</span></p>
                <p>• Margen Inferior: <span className="font-mono text-slate-300">{tmpl.pageSetup.paddingBottom}</span></p>
                <p>• Elementos configurados: <span className="font-mono text-slate-300">{tmpl.elements.length}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedJson(tmpl)}
                  className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Ver JSON Schema</span>
                </button>

                <button
                  onClick={() => handleEdit(tmpl)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
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
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  JSON Schema: {selectedJson.templateId}
                </h3>
                <button
                  onClick={() => setSelectedJson(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <pre className="font-mono text-[11px] bg-slate-950 p-4 rounded-lg text-emerald-400 border border-slate-800 overflow-x-auto">
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
