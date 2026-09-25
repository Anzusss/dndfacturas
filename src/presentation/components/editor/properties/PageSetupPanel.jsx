import React from 'react';
import { Settings2, FileCheck } from 'lucide-react';

/**
 * Extrae el valor numérico en milímetros de un string tipo "50mm".
 * @param {string|number} value
 * @param {number} fallback
 * @returns {number}
 */
const parseMm = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** Límites razonables para márgenes físicos en formato Carta (mm). */
const MARGIN_MIN = 0;
const MARGIN_MAX = 120;

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
  const paddingTopMm = parseMm(template.pageSetup.paddingTop, 50);
  const paddingBottomMm = parseMm(template.pageSetup.paddingBottom, 40);

  /**
   * Actualiza un margen físico (en mm) validando el rango permitido.
   * Persiste el valor en el store con el formato "Xmm" que espera el esquema.
   */
  const handleMarginChange = (key) => (e) => {
    const raw = e.target.value;
    if (raw === '') {
      updatePageSetup({ [key]: '0mm' });
      return;
    }
    const mm = Math.min(MARGIN_MAX, Math.max(MARGIN_MIN, parseInt(raw, 10) || 0));
    updatePageSetup({ [key]: `${mm}mm` });
  };

  return (
    <aside className="no-print w-72 bg-white border-l border-neutral-200 text-neutral-800 flex flex-col h-[calc(100vh-3.5rem)] select-none shadow-sm">
      {/* Encabezado del panel */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Configuración de Página
          </h2>
          <p className="text-[11px] text-subtle mt-0.5">
            Formato de hoja y márgenes de impresión
          </p>
        </div>
        <Settings2 className="w-4 h-4 text-subtle" />
      </div>

      <div className="p-4 space-y-4 text-xs">
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
          {/* Formato de papel (Carta / Letter fijo) */}
          <div>
            <label className="text-[11px] font-medium text-muted block mb-1">
              Formato de Papel
            </label>
            <input
              type="text"
              disabled
              value="CARTA (Letter 216mm × 279mm)"
              className="input-field w-full font-mono text-[11px] bg-neutral-100"
            />
          </div>

          {/* Selector de tipografía predeterminada */}
          <div>
            <label className="text-[11px] font-medium text-muted block mb-1">
              Tipografía Estándar
            </label>
            <select
              value={template.pageSetup.fontFamily}
              onChange={(e) => updatePageSetup({ fontFamily: e.target.value })}
              className="input-field w-full text-xs"
            >
              <option value="'Courier New', Courier, monospace">Courier New (Fiel a Matriz / Fiscal)</option>
              <option value="ui-monospace, monospace">Monospace Moderno</option>
              <option value="system-ui, sans-serif">Sans-serif</option>
            </select>
          </div>

          {/* Entradas numéricas para márgenes físicos (mm) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-muted block mb-1">
                Margen Sup. (Membrete)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={MARGIN_MIN}
                  max={MARGIN_MAX}
                  step={1}
                  value={paddingTopMm}
                  onChange={handleMarginChange('paddingTop')}
                  className="input-field w-full font-mono text-xs pr-7"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-subtle font-mono pointer-events-none">
                  mm
                </span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted block mb-1">
                Margen Inf. (Colectas)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={MARGIN_MIN}
                  max={MARGIN_MAX}
                  step={1}
                  value={paddingBottomMm}
                  onChange={handleMarginChange('paddingBottom')}
                  className="input-field w-full font-mono text-xs pr-7"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-subtle font-mono pointer-events-none">
                  mm
                </span>
              </div>
            </div>
          </div>

          {/* Indicador visual del rango válido */}
          <p className="text-[10px] text-subtle">
            Rango permitido: {MARGIN_MIN}–{MARGIN_MAX} mm. Las guías ámbar en la hoja se actualizan en tiempo real.
          </p>
        </div>

        {/* Mensaje de ayuda contextual */}
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-[11px] text-primary-700 flex items-start gap-2">
          <FileCheck className="w-4 h-4 shrink-0 text-primary-500 mt-0.5" />
          <span>
            Selecciona cualquier elemento en la hoja para ajustar su posición libre (X, Y) o redimensionarlo.
          </span>
        </div>
      </div>
    </aside>
  );
};
