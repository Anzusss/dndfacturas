/**
 * @file Traduce el JSON de la API de facturas (Dynamics) al formato interno
 * InvoiceData que entienden las plantillas.
 *
 * Capa: SERVICIOS (adaptador). Es el ÚNICO archivo que conoce el formato de
 * Dynamics: si la API cambia, solo cambia este archivo.
 *
 * Formato real de la API (septiembre 2026):
 *   { status: "success", message, data: { document_number, document_date, due_date,
 *     customer_name, rif, address, phone, currency_id, exchange_rate,
 *     *_total_transaction / *_total_functional, document_type_id,
 *     lines: [...], payments: [...] } }
 *
 * Particularidades que resuelve este archivo:
 * - Textos con espacios de relleno ("0008894      ") → se recortan.
 * - Importes como texto ("19358955.00000", ".0000000") → se convierten a número
 *   para que el formato fiscal (US$ / Bs) se aplique correctamente.
 * - Fechas ISO ("2026-01-20") → formato venezolano ("20/01/2026").
 * - Moneda: los importes "*_transaction" están en la moneda del documento
 *   (`currency_id`) y los "*_functional" en la moneda funcional (bolívares).
 *   Una factura en VES NO tiene importes en US$: esas columnas quedan vacías
 *   (antes se habrían impreso bolívares con el símbolo US$).
 * - Tipo de documento: `document_type_id` distingue Factura (3) y Nota de
 *   Crédito (4); no representa la condición crédito/contado.
 * - Crédito / contado: se deduce comparando fecha de emisión y vencimiento.
 * - Base imponible y exento: se calculan desde los renglones (con IVA / sin
 *   IVA) porque `exempt_total_*` de la API no cuadra con el IVA cobrado.
 */

import { INVOICE_TYPES } from '@/domain/constants/invoiceTypes';
import { getValueByPath } from '@/domain/models/invoiceData';

/** Moneda funcional de la empresa: los importes `_functional` están en Bs. */
const FUNCTIONAL_CURRENCY = 'VES';

/** Códigos de documento confirmados contra SOPTYPE del backend GP. */
export const DOCUMENT_TYPE_LABELS = {
  3: 'Factura',
  4: 'Nota de Crédito',
};

/**
 * Códigos de pago crédito/contado, si Dynamics llega a enviarlos separados.
 * El endpoint actual no los envía; por eso queda vacío y se usan las fechas.
 */
export const PAYMENT_TYPE_CODES = {};

/**
 * Mapa de rutas. Cada valor puede ser:
 * - Un texto: ruta del dato (se recortan los espacios).
 * - `{ path, type }`: con `type` 'number' (importe/cantidad) o 'date' (fecha ISO).
 * - `null`: el dato no existe en la API (el campo queda vacío).
 */
export const DYNAMICS_FIELD_MAP = {
  /** Estado de la respuesta ("success") y mensaje de error. */
  status: 'status',
  message: 'message',

  /**
   * Código de tipo de documento. PENDIENTE DE CONFIRMAR: en Dynamics GP el
   * tipo 3 suele ser "Factura" (frente a devolución, nota…), no crédito/contado.
   */
  documentTypeCode: 'data.document_type_id',

  /** Moneda del documento ("VES", "USD"…) y tasa de cambio. */
  currency: 'data.currency_id',
  exchangeRate: { path: 'data.exchange_rate', type: 'number' },

  /** Fechas usadas para deducir la condición de pago. */
  documentDate: 'data.document_date',
  dueDate: 'data.due_date',

  /** Campos de cabecera (claves = DYNAMICS_VARIABLES). `pago` se calcula aparte. */
  fields: {
    facturaNo: 'data.document_number',
    cliente: 'data.customer_name',
    rif: 'data.rif',
    direccion: 'data.address',
    telefono: 'data.phone',
    fecha: { path: 'data.document_date', type: 'date' },
    fechaVencimiento: { path: 'data.due_date', type: 'date' },
    municipio: null, // No viene en la API.
    montoIgtfBs: { path: 'data.igtf_functional', type: 'number' },
  },

  /** Lista de renglones y campos de cada renglón (rutas relativas al renglón). */
  itemsPath: 'data.lines',
  itemFields: {
    cantidad: { path: 'quantity', type: 'number' },
    um: null, // No viene unidad de medida.
    descripcion: 'item_description',
  },

  /** Importes de cada renglón en las dos monedas (sufijo _transaction / _functional). */
  lineAmounts: {
    unitPrice: 'unit_price',
    subtotal: 'subtotal',
    tax: 'tax',
  },

  /** Prefijos de los totales del documento (se completan con _transaction / _functional). */
  totalAmounts: {
    net: 'data.net_total',
    tax: 'data.tax_total',
    exempt: 'data.exempt_total',
    grandTotal: 'data.grand_total',
    igtf: 'data.igtf',
  },
};

/**
 * Códigos de `document_type_id` que indican crédito o contado. VACÍO hasta
 * que la empresa confirme su significado; mientras tanto se usan las fechas.
 * Ejemplo si lo confirman: { 3: INVOICE_TYPES.CREDITO, 4: INVOICE_TYPES.CONTADO }
 */
export const DOCUMENT_TYPE_CODES = {};

/**
 * Textos alternativos para crédito/contado (por si algún día la API envía
 * el tipo como texto). Se comparan en mayúsculas y sin tildes.
 */
export const INVOICE_TYPE_ALIASES = {
  [INVOICE_TYPES.CREDITO]: ['CREDITO', 'CREDIT'],
  [INVOICE_TYPES.CONTADO]: ['CONTADO', 'CASH'],
};

/** Devuelve el tipo documental sin confundirlo con crédito/contado. */
export const detectDocumentType = (raw) => {
  const code = getValueByPath(raw, DYNAMICS_FIELD_MAP.documentTypeCode);
  return {
    code: code ?? null,
    label: DOCUMENT_TYPE_LABELS[code] ?? 'Otro',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Conversión de valores
// ─────────────────────────────────────────────────────────────────────────────

/** Recorta espacios de relleno; un texto que solo tenía espacios pasa a `null`. */
const cleanText = (value) => {
  if (typeof value !== 'string') return value ?? null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

/** "19358955.00000" / ".0000000" → número. Devuelve `null` si no es numérico. */
const toNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const text = cleanText(value);
  if (text === null) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
};

/** "2026-01-20" → "20/01/2026". Otros formatos se devuelven recortados. */
const toDisplayDate = (value) => {
  const text = cleanText(value);
  const match = text?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : text;
};

/** Redondea a céntimos (evita 19079137.000000004 al sumar). */
const roundCents = (value) => Math.round(value * 100) / 100;

/**
 * Lee un campo según su definición en el mapa (texto, número, fecha o null).
 * @param {Object} source
 * @param {string|{path:string, type:string}|null} definition
 */
const readField = (source, definition) => {
  if (definition === null || definition === undefined) return null;
  const { path, type } = typeof definition === 'string' ? { path: definition } : definition;
  const value = getValueByPath(source, path);
  if (type === 'number') return toNumber(value);
  if (type === 'date') return toDisplayDate(value);
  return cleanText(value);
};

/** Aplica `readField` a todo un mapa { claveInterna: definición }. */
const readFields = (source, map) =>
  Object.fromEntries(Object.entries(map).map(([key, definition]) => [key, readField(source, definition)]));

/** Mayúsculas y sin tildes, para comparar textos de forma tolerante. */
const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .trim();

// ─────────────────────────────────────────────────────────────────────────────
// Reglas de negocio de la traducción
// ─────────────────────────────────────────────────────────────────────────────

/** Días entre dos fechas ISO (null si alguna no es válida). */
const daysBetween = (fromIso, toIso) => {
  const from = Date.parse(cleanText(fromIso) ?? '');
  const to = Date.parse(cleanText(toIso) ?? '');
  return Number.isFinite(from) && Number.isFinite(to) ? Math.round((to - from) / 86_400_000) : null;
};

/**
 * Tipo de factura y texto de la condición de pago.
 * 1. Si el endpoint envía un código de pago, manda ese código.
 * 2. Si no, por fechas: vencimiento posterior a la emisión = crédito; mismo día = contado.
 *
 * @param {Object} raw
 * @returns {{ invoiceType: string|null, pago: string|null, creditDays: number|null }}
 */
export const detectInvoiceType = (raw) => {
  const code = getValueByPath(raw, DYNAMICS_FIELD_MAP.documentTypeCode);
  const creditDays = daysBetween(
    getValueByPath(raw, DYNAMICS_FIELD_MAP.documentDate),
    getValueByPath(raw, DYNAMICS_FIELD_MAP.dueDate),
  );

  let invoiceType = PAYMENT_TYPE_CODES[code] ?? null;
  if (!invoiceType) {
    const byAlias = Object.entries(INVOICE_TYPE_ALIASES).find(([, aliases]) =>
      aliases.includes(normalizeText(code)),
    );
    invoiceType = byAlias?.[0] ?? null;
  }
  if (!invoiceType && creditDays !== null) {
    invoiceType = creditDays > 0 ? INVOICE_TYPES.CREDITO : INVOICE_TYPES.CONTADO;
  }

  let pago = null;
  if (invoiceType === INVOICE_TYPES.CONTADO) pago = 'CONTADO';
  if (invoiceType === INVOICE_TYPES.CREDITO) {
    pago = creditDays > 0 ? `CREDITO ${String(creditDays).padStart(2, '0')} DIAS` : 'CREDITO';
  }
  return { invoiceType, pago, creditDays };
};

/**
 * Asigna los importes de un par (transaction, functional) a US$ y Bs según la
 * moneda del documento. Los "functional" son siempre bolívares.
 *
 * @param {number|null} transaction Importe en la moneda del documento.
 * @param {number|null} functional  Importe en moneda funcional (Bs).
 * @param {string} currency         Moneda del documento.
 * @returns {{ usd: number|null, bs: number|null }}
 */
const splitByCurrency = (transaction, functional, currency) => ({
  usd: currency === 'USD' ? transaction : null,
  bs: currency === FUNCTIONAL_CURRENCY ? (functional ?? transaction) : functional,
});

/** Lee un importe con sufijo de moneda, p. ej. `data.net_total` + `_functional`. */
const readAmount = (source, prefix, side) => toNumber(getValueByPath(source, `${prefix}_${side}`));

/**
 * Base imponible (renglones con IVA) y exento (renglones sin IVA) en una moneda.
 * @param {Object[]} lines Renglones crudos.
 * @param {'transaction'|'functional'} side
 */
const splitTaxableFromLines = (lines, side) => {
  const { subtotal, tax } = DYNAMICS_FIELD_MAP.lineAmounts;
  const result = lines.reduce(
    (acc, line) => {
      const lineSubtotal = readAmount(line, subtotal, side) ?? 0;
      const lineTax = readAmount(line, tax, side) ?? 0;
      if (lineTax > 0) acc.base += lineSubtotal;
      else acc.exempt += lineSubtotal;
      return acc;
    },
    { base: 0, exempt: 0 },
  );
  return { base: roundCents(result.base), exempt: roundCents(result.exempt) };
};

/** Formato legible de un importe en Bs para los avisos. */
const formatBsForNotice = (amount) =>
  `Bs ${new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;

// ─────────────────────────────────────────────────────────────────────────────
// Traducción completa
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Traduce la respuesta de la API a InvoiceData.
 *
 * @param {Object} raw JSON devuelto por la API.
 * @returns {import('@/domain/models/invoiceData').InvoiceData & { notices: string[] }}
 * @throws {Error} Si la API respondió con error o sin datos.
 */
export const mapDynamicsInvoice = (raw) => {
  const status = cleanText(getValueByPath(raw, DYNAMICS_FIELD_MAP.status));
  if (status && status.toLowerCase() !== 'success') {
    throw new Error(cleanText(getValueByPath(raw, DYNAMICS_FIELD_MAP.message)) || `La API respondió "${status}".`);
  }
  if (!raw?.data) throw new Error('La respuesta de la API no trae el objeto "data" con la factura.');

  const notices = [];
  const currency = normalizeText(getValueByPath(raw, DYNAMICS_FIELD_MAP.currency)) || FUNCTIONAL_CURRENCY;
  const exchangeRate = readField(raw, DYNAMICS_FIELD_MAP.exchangeRate);
  const { invoiceType, pago } = detectInvoiceType(raw);
  const documentType = detectDocumentType(raw);

  if (currency === FUNCTIONAL_CURRENCY) {
    notices.push('Factura en bolívares (VES): los importes en US$ quedan vacíos.');
  } else if (currency !== 'USD') {
    notices.push(`Moneda "${currency}" no reconocida: solo se muestran los importes en Bs.`);
  }
  if (!(getValueByPath(raw, DYNAMICS_FIELD_MAP.documentTypeCode) in PAYMENT_TYPE_CODES)) {
    notices.push(
      `Crédito/contado deducido por fechas (${invoiceType ?? 'sin determinar'}); ` +
        `document_type_id=${documentType.code ?? 'sin dato'} corresponde a ${documentType.label}.`,
    );
  }

  // Renglones: textos + importes en las dos monedas.
  const rawLines = getValueByPath(raw, DYNAMICS_FIELD_MAP.itemsPath);
  const lines = Array.isArray(rawLines) ? rawLines : [];
  const { unitPrice, subtotal } = DYNAMICS_FIELD_MAP.lineAmounts;
  const items = lines.map((line) => {
    const price = splitByCurrency(
      readAmount(line, unitPrice, 'transaction'),
      readAmount(line, unitPrice, 'functional'),
      currency,
    );
    const lineSubtotal = splitByCurrency(
      readAmount(line, subtotal, 'transaction'),
      readAmount(line, subtotal, 'functional'),
      currency,
    );
    return {
      ...readFields(line, DYNAMICS_FIELD_MAP.itemFields),
      precioUsd: price.usd,
      precioBs: price.bs,
      subtotalUsd: lineSubtotal.usd,
      subtotalBs: lineSubtotal.bs,
    };
  });

  // Totales del documento.
  const { net, tax, exempt, grandTotal, igtf } = DYNAMICS_FIELD_MAP.totalAmounts;
  const total = (prefix) =>
    splitByCurrency(readAmount(raw, prefix, 'transaction'), readAmount(raw, prefix, 'functional'), currency);

  // Base imponible y exento desde los renglones (ver cabecera del archivo).
  const taxableTransaction = splitTaxableFromLines(lines, 'transaction');
  const taxableFunctional = splitTaxableFromLines(lines, 'functional');
  const base = splitByCurrency(taxableTransaction.base, taxableFunctional.base, currency);
  const exento = splitByCurrency(taxableTransaction.exempt, taxableFunctional.exempt, currency);

  const apiExemptBs = total(exempt).bs;
  if (apiExemptBs !== null && Math.abs(apiExemptBs - (exento.bs ?? 0)) > 0.01) {
    notices.push(
      `El exento que envía la API (${formatBsForNotice(apiExemptBs)}) no coincide con los renglones sin IVA ` +
        `(${formatBsForNotice(exento.bs ?? 0)}); se usa el calculado desde los renglones. Confirmar con la empresa.`,
    );
  }
  const netBs = total(net).bs;
  if (netBs !== null && Math.abs(netBs - ((base.bs ?? 0) + (exento.bs ?? 0))) > 0.01) {
    notices.push('La suma de los renglones no coincide con el subtotal (net_total) de la API.');
  }

  return {
    invoiceType,
    documentTypeId: documentType.code,
    documentType: documentType.label,
    tipoDocumento: documentType.label,
    ...readFields(raw, DYNAMICS_FIELD_MAP.fields),
    pago,
    moneda: currency,
    // Una tasa 0 significa "no aplica" (factura en bolívares).
    tasaCambio: exchangeRate ? exchangeRate : null,
    items,
    totales: {
      baseImponibleUsd: base.usd,
      baseImponibleBs: base.bs,
      ivaUsd: total(tax).usd,
      ivaBs: total(tax).bs,
      exentoUsd: exento.usd,
      exentoBs: exento.bs,
      totalGeneralUsd: total(grandTotal).usd,
      totalGeneralBs: total(grandTotal).bs,
      igtfUsd: total(igtf).usd,
      igtfBs: total(igtf).bs,
    },
    notices,
  };
};
