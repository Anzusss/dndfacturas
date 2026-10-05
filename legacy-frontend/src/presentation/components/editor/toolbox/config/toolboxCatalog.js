/**
 * @file Catálogo de elementos insertables desde el Toolbox.
 *
 * Para añadir un elemento nuevo basta con agregar una entrada a TOOLBOX_ITEMS;
 * `data` son los datos parciales con los que se creará el bloque (el id y
 * la posición los asigna `createElement` en el dominio).
 */

import { LayoutGrid, Table2, Calculator, Type, Minus } from 'lucide-react';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { DEFAULT_TABLE_COLUMNS } from '@/domain/models/tableColumns';
import { DEFAULT_TOTALS_ROWS, LEGAL_TEXT_IGTF_SHORT } from '@/domain/models/sampleData';
import { LINE_DEFAULTS } from '@/domain/models/elementFactory';

/** Pestañas de filtrado del Toolbox. */
export const TOOLBOX_CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'structures', label: 'Estructuras' },
  { id: 'shapes', label: 'Formas & Líneas' },
  { id: 'erp', label: 'Campos ERP' },
];

/** Elementos estructurales y formas disponibles. */
export const TOOLBOX_ITEMS = [
  // ───── Estructuras base ─────
  {
    category: 'structures',
    title: 'Bloque de Datos (Grid)',
    subtitle: 'Cliente, RIF, Control Doc',
    icon: LayoutGrid,
    iconColor: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20',
    data: {
      type: ELEMENT_TYPES.GRID,
      title: 'Datos del Cliente',
      width: 440,
      height: 115,
      fields: ['cliente', 'rif', 'direccion', 'telefono'],
    },
  },
  {
    category: 'structures',
    title: 'Tabla de Renglones',
    subtitle: 'Columnas US$ / Bs.',
    icon: Table2,
    iconColor: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
    data: {
      type: ELEMENT_TYPES.TABLE,
      title: 'Detalle de Factura',
      width: 702,
      height: 140,
      columns: DEFAULT_TABLE_COLUMNS,
    },
  },
  {
    category: 'structures',
    title: 'Módulo de Totales',
    subtitle: 'Base, IVA, Exento, Total, IGTF',
    icon: Calculator,
    iconColor: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
    data: {
      type: ELEMENT_TYPES.TOTALS,
      title: 'Resumen de Totales',
      width: 380,
      height: 155,
      totalsRows: DEFAULT_TOTALS_ROWS,
    },
  },
  {
    category: 'structures',
    title: 'Texto / Leyenda Legal',
    subtitle: 'Providencia IGTF y Tasa BCV',
    icon: Type,
    iconColor: 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20',
    data: {
      type: ELEMENT_TYPES.TEXT,
      title: 'Leyenda Legal IGTF',
      width: 702,
      height: 120,
      content: LEGAL_TEXT_IGTF_SHORT,
    },
  },

  // ───── Formas y figuras ─────
  {
    category: 'shapes',
    title: 'Línea Horizontal',
    subtitle: 'Separador de tabla o secciones',
    icon: Minus,
    iconColor: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
    data: {
      type: ELEMENT_TYPES.LINE,
      title: 'Línea Divisoria',
      width: 702,
      height: 10,
      ...LINE_DEFAULTS,
    },
  },
];

/**
 * Datos del bloque que se crea al insertar una variable suelta del ERP.
 * El valor se lee de la factura al dibujar (no se guarda un valor de ejemplo).
 * @param {import('@/domain/constants/dynamicsVariables').InvoiceField} variable
 * @returns {Object}
 */
export const createVariablePayload = (variable) => ({
  type: ELEMENT_TYPES.VARIABLE,
  title: variable.label,
  variableKey: variable.key,
  width: 220,
  height: 40,
});
