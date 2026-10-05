/**
 * @file Modelo de plantilla de factura (InvoiceTemplate).
 *
 * Capa: DOMINIO. Define la forma del JSON que se guarda (hoy en
 * localStorage, mañana en PostgreSQL vía NestJS) y las funciones para
 * crear/normalizar plantillas.
 *
 * Cada registro es una VERSIÓN concreta de una plantilla:
 * {
 *   $schema, schemaVersion,           // formato del JSON (para migraciones)
 *   templateId, version, name,        // identidad
 *   invoiceType,                      // CREDITO | CONTADO
 *   status, reviewComment,            // ciclo de vida (ver templateLifecycle.js)
 *   createdAt, updatedAt, updatedBy, approvedBy, approvedAt,
 *   pageSetup, elements               // diseño (pageSetup.size/orientation: ver paperSizes.js)
 * }
 */

import { PAPER_DIMENSIONS } from '../constants/paperDimensions';
import {
  PAPER_ORIENTATION,
  buildPaperSetup,
  fitRectToSheet,
  getPaperDimensions,
} from '../constants/paperSizes';
import { ELEMENT_TYPES, LEGACY_ELEMENT_TYPES } from '../constants/elementTypes';
import { INVOICE_TYPES } from '../constants/invoiceTypes';
import { TEMPLATE_STATUS } from './templateLifecycle';
import { DEFAULT_TABLE_COLUMNS, normalizeTableColumns } from './tableColumns';
import { DEFAULT_TOTALS_ROWS, LEGAL_TEXT_IGTF } from './sampleData';

/**
 * Versión del formato del JSON. Súbela cuando cambie la estructura y añade
 * la migración correspondiente en `normalizeTemplate`.
 */
export const TEMPLATE_SCHEMA_VERSION = 1;

/** Plantillas de referencia que se crean la primera vez. */
export const DEFAULT_TEMPLATE_ID = 'factura-fiscal-real-v1';
export const DEFAULT_CONTADO_TEMPLATE_ID = 'factura-contado-v1';

/** Usuario con el que se firman las plantillas creadas automáticamente. */
const SYSTEM_USER = 'sistema';

/** Campos completos de la cabecera documental que entrega Dynamics GP. */
const DEFAULT_DOCUMENT_FIELDS = ['facturaNo', 'fecha', 'fechaVencimiento', 'pago'];

/** Configuración de página por defecto (Carta con márgenes para membrete). */
const createDefaultPageSetup = () => ({
  size: PAPER_DIMENSIONS.SIZE,
  orientation: PAPER_ORIENTATION.PORTRAIT,
  width: `${PAPER_DIMENSIONS.WIDTH_MM}mm`,
  minHeight: `${PAPER_DIMENSIONS.HEIGHT_MM}mm`,
  paddingTop: `${PAPER_DIMENSIONS.MARGIN_TOP_MM}mm`,
  paddingBottom: `${PAPER_DIMENSIONS.MARGIN_BOTTOM_MM}mm`,
  paddingLeft: `${PAPER_DIMENSIONS.MARGIN_LEFT_MM}mm`,
  paddingRight: `${PAPER_DIMENSIONS.MARGIN_RIGHT_MM}mm`,
  fontFamily: PAPER_DIMENSIONS.FONT_FAMILY_DEFAULT,
});

/** Bloques del formato fiscal real (Dynamics + SENIAT, doble moneda US$ / Bs.). */
const createDefaultElements = () => [
  {
    id: 'client-info-block',
    type: ELEMENT_TYPES.GRID,
    title: 'Datos del Cliente',
    x: 57,
    y: 195,
    width: 440,
    height: 115,
    fields: ['cliente', 'rif', 'direccion', 'telefono'],
  },
  {
    id: 'doc-info-block',
    type: ELEMENT_TYPES.GRID,
    title: 'Control de Documento',
    x: 520,
    y: 195,
    width: 239,
    height: 115,
    fields: DEFAULT_DOCUMENT_FIELDS,
  },
  {
    id: 'items-table-block',
    type: ELEMENT_TYPES.TABLE,
    title: 'Tabla de Bienes / Servicios',
    x: 57,
    y: 330,
    width: 702,
    height: 140,
    columns: structuredClone(DEFAULT_TABLE_COLUMNS),
  },
  {
    id: 'legal-text-block',
    type: ELEMENT_TYPES.TEXT,
    title: 'Leyenda Legal IGTF y Tasa BCV',
    x: 57,
    y: 540,
    width: 702,
    height: 120,
    content: LEGAL_TEXT_IGTF,
  },
  {
    id: 'totals-section-block',
    type: ELEMENT_TYPES.TOTALS,
    title: 'Resumen de Totales y Liquidación',
    x: 379,
    y: 680,
    width: 380,
    height: 155,
    totalsRows: structuredClone(DEFAULT_TOTALS_ROWS),
  },
];

/**
 * Márgenes del diseño base de media carta. SUPUESTOS: ajústalos cuando se
 * conozca el tamaño real del membrete de la empresa.
 */
const HALF_LETTER_MARGINS = { paddingTop: '25mm', paddingBottom: '15mm', paddingLeft: '10mm', paddingRight: '10mm' };

/**
 * Diseño base para MEDIA CARTA HORIZONTAL (216 × 140 mm = 816 × 529 px):
 * cliente y control arriba, tabla en el centro, leyenda y totales abajo.
 * Zona imprimible con los márgenes base: y = 94 px (25 mm) a 472 px (140 − 15 mm).
 */
const createHalfLetterElements = () => [
  {
    id: 'client-info-block',
    type: ELEMENT_TYPES.GRID,
    title: 'Datos del Cliente',
    x: 38,
    y: 96,
    width: 470,
    height: 118,
    fields: ['cliente', 'rif', 'direccion', 'telefono'],
  },
  {
    id: 'doc-info-block',
    type: ELEMENT_TYPES.GRID,
    title: 'Control de Documento',
    x: 530,
    y: 96,
    width: 248,
    height: 118,
    fields: DEFAULT_DOCUMENT_FIELDS,
  },
  {
    id: 'items-table-block',
    type: ELEMENT_TYPES.TABLE,
    title: 'Tabla de Bienes / Servicios',
    x: 38,
    y: 220,
    width: 740,
    height: 110,
    columns: structuredClone(DEFAULT_TABLE_COLUMNS),
  },
  {
    id: 'legal-text-block',
    type: ELEMENT_TYPES.TEXT,
    title: 'Leyenda Legal IGTF y Tasa BCV',
    x: 38,
    y: 336,
    width: 370,
    height: 134,
    content: LEGAL_TEXT_IGTF,
  },
  {
    id: 'totals-section-block',
    type: ELEMENT_TYPES.TOTALS,
    title: 'Resumen de Totales y Liquidación',
    x: 420,
    y: 336,
    width: 358,
    height: 134,
    totalsRows: structuredClone(DEFAULT_TOTALS_ROWS),
  },
];

/**
 * Metadatos comunes de un registro nuevo.
 * @param {{templateId:string, name:string, invoiceType:string, status:string, user:string}} params
 */
const createMetadata = ({ templateId, name, invoiceType, status, user }) => {
  const now = new Date().toISOString();
  const isApproved = status === TEMPLATE_STATUS.APPROVED;
  return {
    $schema: 'InvoiceTemplate',
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateId,
    version: 1,
    name,
    invoiceType,
    status,
    reviewComment: null,
    createdAt: now,
    updatedAt: now,
    updatedBy: user,
    approvedBy: isApproved ? user : null,
    approvedAt: isApproved ? now : null,
  };
};

/**
 * Diseño por defecto (página + bloques) sin metadatos.
 *
 * Sin argumento devuelve el diseño Carta. Con la configuración de página
 * actual (lo usa "Restaurar"), respeta el tamaño de hoja elegido:
 * - Media carta horizontal → diseño base específico y sus márgenes.
 * - Carta vertical         → diseño Carta original.
 * - Otros tamaños          → diseño Carta ajustado para que quepa en la hoja.
 *
 * @param {Object} [pageSetup] Configuración de página actual.
 * @returns {{pageSetup:Object, elements:Object[]}}
 */
export const createDefaultLayout = (pageSetup) => {
  if (!pageSetup) return { pageSetup: createDefaultPageSetup(), elements: createDefaultElements() };

  const dims = getPaperDimensions(pageSetup);
  // Campos de tamaño de la hoja actual (se conservan al restaurar).
  const paper = buildPaperSetup({
    size: dims.sizeId,
    orientation: dims.orientation,
    customWidthMm: dims.widthMm,
    customHeightMm: dims.heightMm,
  });

  if (dims.sizeId === 'HALF_LETTER' && dims.orientation === PAPER_ORIENTATION.LANDSCAPE) {
    return {
      pageSetup: { ...createDefaultPageSetup(), ...HALF_LETTER_MARGINS, fontFamily: pageSetup.fontFamily, ...paper },
      elements: createHalfLetterElements(),
    };
  }

  const elements = createDefaultElements().map((element) => ({ ...element, ...fitRectToSheet(element, dims) }));
  return { pageSetup: { ...createDefaultPageSetup(), fontFamily: pageSetup.fontFamily, ...paper }, elements };
};

/**
 * Plantilla fiscal de CRÉDITO por defecto, ya aprobada (se activa al iniciar
 * para poder imprimir desde el primer momento).
 */
export const createDefaultInvoiceTemplate = () => ({
  ...createMetadata({
    templateId: DEFAULT_TEMPLATE_ID,
    name: 'Factura Fiscal Crédito (Formato Carta)',
    invoiceType: INVOICE_TYPES.CREDITO,
    status: TEMPLATE_STATUS.APPROVED,
    user: SYSTEM_USER,
  }),
  ...createDefaultLayout(),
});

/** Plantilla fiscal de CONTADO por defecto (mismo diseño), ya aprobada. */
export const createDefaultContadoTemplate = () => ({
  ...createMetadata({
    templateId: DEFAULT_CONTADO_TEMPLATE_ID,
    name: 'Factura Fiscal Contado (Formato Carta)',
    invoiceType: INVOICE_TYPES.CONTADO,
    status: TEMPLATE_STATUS.APPROVED,
    user: SYSTEM_USER,
  }),
  ...createDefaultLayout(),
});

/**
 * Plantilla nueva en blanco (borrador, sin bloques) con id único.
 * @param {string} [invoiceType]
 * @param {string} [user]
 */
export const createBlankInvoiceTemplate = (invoiceType = INVOICE_TYPES.CREDITO, user = SYSTEM_USER) => ({
  ...createMetadata({
    templateId: `plantilla-${Date.now()}`,
    name: 'Nueva Plantilla',
    invoiceType,
    status: TEMPLATE_STATUS.DRAFT,
    user,
  }),
  pageSetup: createDefaultPageSetup(),
  elements: [],
});

/**
 * Migra filas de totales antiguas, que llevaban los importes escritos a mano
 * (`usd`, `bs`), al formato enlazado (`usdKey`, `bsKey`). Las 5 filas
 * estándar se enlazan por posición; las demás conservan su texto fijo.
 */
const normalizeTotalsRows = (rows) =>
  rows?.map((row, index) => {
    if (row.usdKey || row.bsKey) return row;
    const defaults = DEFAULT_TOTALS_ROWS[index];
    return defaults ? { ...defaults, label: row.label ?? defaults.label, isBold: row.isBold } : row;
  });

/**
 * Normaliza un bloque guardado con un formato anterior.
 * @param {Object} element
 * @returns {Object}
 */
const normalizeElement = (element) => {
  const type = LEGACY_ELEMENT_TYPES[element.type] ?? element.type;
  // `sampleRows` / `sampleValue`: antes cada bloque llevaba sus datos de ejemplo;
  // ahora los datos llegan aparte (SAMPLE_INVOICE_DATA o la API).
  const { sampleRows: _sampleRows, sampleValue: _sampleValue, ...rest } = element;
  const normalized = { ...rest, type };

  if (type === ELEMENT_TYPES.GRID && element.id === 'doc-info-block') {
    normalized.fields = [...new Set([...(element.fields ?? []), ...DEFAULT_DOCUMENT_FIELDS])].filter(
      (field) => field !== 'tipoDocumento' && field !== 'moneda',
    );
  }

  if (type === ELEMENT_TYPES.TABLE) normalized.columns = normalizeTableColumns(element.columns);
  if (type === ELEMENT_TYPES.TOTALS && element.totalsRows) {
    normalized.totalsRows = normalizeTotalsRows(element.totalsRows);
  }
  return normalized;
};

/**
 * Asegura que una plantilla (de localStorage, de la API o importada) cumpla
 * con el formato actual. Rellena los metadatos que falten.
 *
 * @param {Object} template
 * @returns {Object}
 */
export const normalizeTemplate = (template) => ({
  $schema: 'InvoiceTemplate',
  reviewComment: null,
  approvedBy: null,
  approvedAt: null,
  ...template,
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
  version: template.version ?? 1,
  invoiceType: template.invoiceType ?? INVOICE_TYPES.CREDITO,
  status: template.status ?? TEMPLATE_STATUS.DRAFT,
  pageSetup: { ...createDefaultPageSetup(), ...template.pageSetup },
  elements: (template.elements ?? []).map(normalizeElement),
});
