import React from 'react';
import { Settings2, FileCheck } from 'lucide-react';

/**
 * Componente PageSetupPanel
 * Se visualiza en la barra lateral derecha cuando el usuario NO tiene ningún bloque seleccionado.
 * Permite ajustar los parámetros globales de la hoja y la impresión:
 * - Selección de tipografía fija (Courier New, Monospace, Sans-serif).
 * - Ajuste milimétrico de los márgenes físicos para papel membretado (superior) y firmas (inferior).
 *
 * @param {Object} props
 * @param {Object} props.template - Plantilla activa con su configuración de página (pageSetup).
 * @param {Function} props.updatePageSetup - Función del store para actualizar márgenes o fuentes.
 */
export const PageSetupPanel = ({ template, updatePageSetup }) => {
  return (
    <aside className="no-print w-72 bg-slate-900 border-l border-slate-800 text-slate-200 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Encabezado del panel */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Configuración de Página
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Formato de hoja y márgenes de impresión
          </p>
        </div>
        <Settings2 className="w-4 h-4 text-slate-500" />
      </div>

      <div className="p-4 space-y-4 text-xs">
        <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 space-y-3">
          {/* Formato de papel (Carta / Letter fijo) */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Formato de Papel
            </label>
            <input
              type="text"
              disabled
              value="CARTA (Letter 216mm × 279mm)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-300 font-mono text-[11px]"
            />
          </div>

          {/* Selector de tipografía predeterminada */}
          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Tipografía Estándar
            </label>
            <select
              value={template.pageSetup.fontFamily}
              onChange={(e) => updatePageSetup({ fontFamily: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 text-xs"
            >
              <option value="'Courier New', Courier, monospace">Courier New (Fiel a Matriz / Fiscal)</option>
              <option value="ui-monospace, monospace">Monospace Moderno</option>
              <option value="system-ui, sans-serif">Sans-serif</option>
            </select>
          </div>

          {/* Entradas de texto para márgenes físicos */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Margen Sup. (Membrete)
              </label>
              <input
                type="text"
                value={template.pageSetup.paddingTop}
                onChange={(e) => updatePageSetup({ paddingTop: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Margen Inf. (Colectas)
              </label>
              <input
                type="text"
                value={template.pageSetup.paddingBottom}
                onChange={(e) => updatePageSetup({ paddingBottom: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Mensaje de ayuda contextual */}
        <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-[11px] text-indigo-300 flex items-start gap-2">
          <FileCheck className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
          <span>
            Selecciona cualquier elemento en la hoja para ajustar su posición libre (X, Y) o redimensionarlo.
          </span>
        </div>
      </div>
    </aside>
  );
};
