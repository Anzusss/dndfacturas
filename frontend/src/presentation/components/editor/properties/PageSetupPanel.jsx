/**
 * @file Configuración global de la plantilla (visible cuando no hay bloque
 * seleccionado): nombre, tipo de factura, tamaño de hoja, tipografía y
 * márgenes físicos.
 * Si la plantilla no es un borrador, todos los campos quedan deshabilitados.
 */

import { Settings2, FileCheck } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { selectIsEditable } from '@/store/editorSelectors';
import { FONT_OPTIONS, MARGIN_LIMITS_MM, resolveFontOption } from '@/domain/constants/editorConfig';
import { PAPER_DIMENSIONS } from '@/domain/constants/paperDimensions';
import { MIN_PRINTABLE_HEIGHT_MM, getPaperDimensions } from '@/domain/constants/paperSizes';
import { INVOICE_TYPE_LABELS, INVOICE_TYPE_LIST } from '@/domain/constants/invoiceTypes';
import { parseMm } from '@/utils/units';
import { SidebarPanel } from '@/presentation/components/common/SidebarPanel';
import { FormField } from '@/presentation/components/common/FormField';
import { NumberField } from '@/presentation/components/common/NumberField';
import { PropertySection } from './PropertySection';
import { PaperSizeSection } from './PaperSizeSection';

/** Márgenes editables: clave en `pageSetup`, etiqueta y valor por defecto. */
const MARGIN_FIELDS = [
  { key: 'paddingTop', label: 'Margen Sup. (Membrete)', fallback: PAPER_DIMENSIONS.MARGIN_TOP_MM },
  { key: 'paddingBottom', label: 'Margen Inf. (Colectas)', fallback: PAPER_DIMENSIONS.MARGIN_BOTTOM_MM },
];

/** Clases comunes de los campos (con estilo de deshabilitado). */
const INPUT_CLASS = 'input-field w-full text-xs disabled:bg-neutral-100 disabled:text-neutral-500';

/** Limita un margen al rango permitido; un campo vacío equivale a 0 mm. */
const clampMargin = (mm, max) => Math.min(max, Math.max(MARGIN_LIMITS_MM.MIN, mm ?? 0));

export const PageSetupPanel = ({ collapsible = false, open = true, onToggle }) => {
  const template = useEditorStore((s) => s.template);
  const editable = useEditorStore(selectIsEditable);
  const updatePageSetup = useEditorStore((s) => s.updatePageSetup);
  const renameTemplate = useEditorStore((s) => s.renameTemplate);
  const setInvoiceType = useEditorStore((s) => s.setInvoiceType);
  const { pageSetup } = template;
  const disabled = !editable;

  // El margen máximo depende del alto de la hoja (en media carta 120 mm no tiene sentido).
  const { heightMm } = getPaperDimensions(pageSetup);
  const maxMargin = Math.max(0, Math.min(MARGIN_LIMITS_MM.MAX, heightMm - MIN_PRINTABLE_HEIGHT_MM));
  const marginsTotal = MARGIN_FIELDS.reduce((sum, { key, fallback }) => sum + parseMm(pageSetup[key], fallback), 0);
  const marginsTooBig = heightMm - marginsTotal < MIN_PRINTABLE_HEIGHT_MM;

  return (
    <SidebarPanel
      title="Configuración de Página"
      subtitle="Plantilla, formato de hoja y márgenes"
      icon={Settings2}
      collapsible={collapsible}
      open={open}
      onToggle={onToggle}
    >
      <PropertySection>
        <FormField label="Nombre de la Plantilla">
          {(id) => (
            <input
              id={id}
              type="text"
              value={template.name}
              disabled={disabled}
              onChange={(e) => renameTemplate(e.target.value)}
              className={INPUT_CLASS}
            />
          )}
        </FormField>

        {/* La plantilla solo podrá activarse para facturas de este tipo. */}
        <FormField label="Tipo de Factura">
          {(id) => (
            <select
              id={id}
              value={template.invoiceType}
              disabled={disabled}
              onChange={(e) => setInvoiceType(e.target.value)}
              className={INPUT_CLASS}
            >
              {INVOICE_TYPE_LIST.map((type) => (
                <option key={type} value={type}>
                  {INVOICE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <PaperSizeSection disabled={disabled} />

        <FormField label="Tipografía Estándar">
          {(id) => (
            <select
              id={id}
              value={resolveFontOption(pageSetup.fontFamily)}
              disabled={disabled}
              onChange={(e) => updatePageSetup({ fontFamily: e.target.value })}
              className={INPUT_CLASS}
            >
              {FONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </FormField>

        {/* Márgenes físicos: se guardan como "Xmm" según el esquema de la plantilla. */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {MARGIN_FIELDS.map(({ key, label, fallback }) => (
            <NumberField
              key={key}
              label={label}
              unit="mm"
              min={MARGIN_LIMITS_MM.MIN}
              max={maxMargin}
              disabled={disabled}
              value={parseMm(pageSetup[key], fallback)}
              onChange={(mm) => updatePageSetup({ [key]: `${clampMargin(mm, maxMargin)}mm` })}
            />
          ))}
        </div>

        <p className={`text-[10px] ${marginsTooBig ? 'text-error-600 font-medium' : 'text-subtle'}`}>
          {marginsTooBig
            ? `Los márgenes dejan menos de ${MIN_PRINTABLE_HEIGHT_MM} mm imprimibles en esta hoja; redúcelos.`
            : `Rango permitido: ${MARGIN_LIMITS_MM.MIN}–${maxMargin} mm. Las guías ámbar se actualizan en tiempo real.`}
        </p>
      </PropertySection>

      {/* Ayuda contextual */}
      <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg text-[11px] text-primary-700 flex items-start gap-2">
        <FileCheck className="w-4 h-4 shrink-0 text-primary-500 mt-0.5" />
        <span>
          {editable
            ? 'Selecciona cualquier elemento en la hoja para ajustar su posición libre (X, Y) o redimensionarlo.'
            : 'Vista de solo lectura. Los datos que ves son la factura de ejemplo.'}
        </span>
      </div>
    </SidebarPanel>
  );
};
