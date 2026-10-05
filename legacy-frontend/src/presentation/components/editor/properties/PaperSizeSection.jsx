/**
 * @file Selección del tamaño de hoja: Carta, Media carta, Cuarto de carta,
 * Oficio o Personalizado, con su orientación.
 *
 * Si al cambiar a un papel más pequeño algún bloque queda fuera, avisa y
 * ofrece dos soluciones: ajustarlos a la hoja o cargar el diseño base del
 * nuevo tamaño (existe uno específico para media carta horizontal).
 */

import { AlertTriangle } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import {
  CUSTOM_PAPER_LIMITS_MM,
  CUSTOM_PAPER_SIZE,
  PAPER_ORIENTATION,
  PAPER_ORIENTATION_LABELS,
  PAPER_SIZES,
  PAPER_SIZES_BY_ID,
  getPaperDimensions,
} from '@/domain/constants/paperSizes';
import { isElementOutsideSheet } from '@/domain/models/elementFactory';
import { FormField } from '@/presentation/components/common/FormField';
import { NumberField } from '@/presentation/components/common/NumberField';

/** Limita una medida personalizada (campo vacío → mínimo). */
const clampCustom = (value, max) => Math.min(max, Math.max(1, value ?? CUSTOM_PAPER_LIMITS_MM.MIN));

/**
 * @param {Object}  props
 * @param {boolean} props.disabled La plantilla no es un borrador.
 */
export const PaperSizeSection = ({ disabled }) => {
  const pageSetup = useEditorStore((s) => s.template.pageSetup);
  const elements = useEditorStore((s) => s.template.elements);
  const setPaperSize = useEditorStore((s) => s.setPaperSize);
  const fitElementsToSheet = useEditorStore((s) => s.fitElementsToSheet);
  const resetToDefault = useEditorStore((s) => s.resetToDefault);

  const dims = getPaperDimensions(pageSetup);
  const isCustom = dims.sizeId === CUSTOM_PAPER_SIZE;
  const outsideCount = elements.filter((element) => isElementOutsideSheet(element, dims)).length;

  /** Cambia de tamaño; los predefinidos usan su orientación habitual. */
  const handleSizeChange = (event) => {
    const size = event.target.value;
    setPaperSize(
      size === CUSTOM_PAPER_SIZE
        ? { size, customWidthMm: dims.widthMm, customHeightMm: dims.heightMm } // Parte de las medidas actuales.
        : { size },
    );
  };

  /** Actualiza una medida del tamaño personalizado. */
  const setCustom = (widthMm, heightMm) =>
    setPaperSize({ size: CUSTOM_PAPER_SIZE, customWidthMm: widthMm, customHeightMm: heightMm });

  /** Sustituye los bloques por el diseño base del tamaño actual (tras confirmar). */
  const handleBaseLayout = () => {
    if (window.confirm('Se reemplazarán los bloques por el diseño base de este tamaño de hoja. ¿Continuar?')) {
      resetToDefault();
    }
  };

  return (
    <div className="space-y-3">
      <FormField label="Tamaño de Hoja">
        {(id) => (
          <select
            id={id}
            value={dims.sizeId}
            disabled={disabled}
            onChange={handleSizeChange}
            className="input-field w-full text-xs disabled:bg-neutral-100 disabled:text-neutral-500"
          >
            {PAPER_SIZES.map((size) => (
              <option key={size.id} value={size.id}>
                {size.label} — {size.inches}
              </option>
            ))}
            <option value={CUSTOM_PAPER_SIZE}>Personalizado</option>
          </select>
        )}
      </FormField>

      {/* Orientación (solo tamaños predefinidos; en personalizado se define con ancho y alto). */}
      {!isCustom && (
        <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200" role="radiogroup">
          {Object.values(PAPER_ORIENTATION).map((orientation) => {
            const active = dims.orientation === orientation;
            return (
              <button
                key={orientation}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                onClick={() => setPaperSize({ size: dims.sizeId, orientation })}
                className={`py-1 rounded-md text-[11px] font-medium transition disabled:opacity-50 ${
                  active ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {PAPER_ORIENTATION_LABELS[orientation]}
              </button>
            );
          })}
        </div>
      )}

      {isCustom && (
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="Ancho"
            unit="mm"
            disabled={disabled}
            value={dims.widthMm}
            onChange={(v) => setCustom(clampCustom(v, CUSTOM_PAPER_LIMITS_MM.MAX_WIDTH), dims.heightMm)}
          />
          <NumberField
            label="Alto"
            unit="mm"
            disabled={disabled}
            value={dims.heightMm}
            onChange={(v) => setCustom(dims.widthMm, clampCustom(v, CUSTOM_PAPER_LIMITS_MM.MAX_HEIGHT))}
          />
        </div>
      )}

      <p className="text-[10px] text-subtle">
        Hoja actual: {dims.widthMm} × {dims.heightMm} mm
        {!isCustom && ` (${PAPER_SIZES_BY_ID[dims.sizeId].label.toLowerCase()} ${PAPER_ORIENTATION_LABELS[dims.orientation].toLowerCase()})`}.
        {isCustom && ` Recomendado entre ${CUSTOM_PAPER_LIMITS_MM.MIN} y ${CUSTOM_PAPER_LIMITS_MM.MAX_WIDTH} mm de ancho.`}
      </p>

      {/* Bloques fuera de la hoja tras cambiar el tamaño */}
      {outsideCount > 0 && (
        <div className="p-2.5 rounded-lg bg-warning-50 border border-warning-100 text-[11px] text-warning-600 space-y-2">
          <p className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {outsideCount === 1 ? '1 bloque queda' : `${outsideCount} bloques quedan`} fuera de la hoja y no se
            imprimirían completos.
          </p>
          {!disabled && (
            <div className="flex gap-2">
              <button type="button" onClick={fitElementsToSheet} className="btn-secondary px-2 py-1 text-[11px]">
                Ajustar a la hoja
              </button>
              <button type="button" onClick={handleBaseLayout} className="btn-secondary px-2 py-1 text-[11px]">
                Usar diseño base
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
