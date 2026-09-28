/**
 * @file Traduce el JSON de la API de facturas (Dynamics) al formato interno
 * InvoiceData que entienden las plantillas.
 *
 * Capa: SERVICIOS (adaptador).
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  CUANDO LLEGUE EL JSON REAL, NORMALMENTE SOLO HAY QUE TOCAR          │
 * │  `DYNAMICS_FIELD_MAP` e `INVOICE_TYPE_ALIASES`.                      │
 * │  Cada valor es la RUTA del dato dentro del JSON de la API, con       │
 * │  puntos para objetos anidados (p. ej. 'cliente.razonSocial').        │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * Así el editor, las plantillas y los bloques no dependen del formato de
 * Dynamics: si la API cambia, solo cambia este archivo.
 */

import { INVOICE_TYPES } from '@/domain/constants/invoiceTypes';
import { getValueByPath } from '@/domain/models/invoiceData';

/**
 * Mapa campo interno → ruta en el JSON de la API.
 * Los valores actuales coinciden con el mock (`mockInvoices.js`).
 */
export const DYNAMICS_FIELD_MAP = {
  /** Campo que indica si es crédito o contado. */
  invoiceType: 'tipoFactura',

  /** Campos de cabecera (claves = DYNAMICS_VARIABLES). */
  fields: {
    facturaNo: 'facturaNo',
    cliente: 'cliente',
    rif: 'rif',
    direccion: 'direccion',
    telefono: 'telefono',
    fecha: 'fecha',
    pago: 'pago',
    tasaCambio: 'tasaCambio',
    municipio: 'municipio',
    montoIgtfBs: 'montoIgtfBs',
  },

  /** Ruta de la lista de renglones. */
  itemsPath: 'items',

  /** Campos de cada renglón, relativos al renglón (claves = ITEM_FIELDS). */
  itemFields: {
    cantidad: 'cantidad',
    um: 'um',
    descripcion: 'descripcion',
    precioUsd: 'precioUsd',
    subtotalUsd: 'subtotalUsd',
    subtotalBs: 'subtotalBs',
  },

  /** Totales (claves = TOTAL_FIELDS sin el prefijo "totales."). */
  totals: {
    baseImponibleUsd: 'totales.baseImponibleUsd',
    baseImponibleBs: 'totales.baseImponibleBs',
    ivaUsd: 'totales.ivaUsd',
    ivaBs: 'totales.ivaBs',
    exentoUsd: 'totales.exentoUsd',
    exentoBs: 'totales.exentoBs',
    totalGeneralUsd: 'totales.totalGeneralUsd',
    totalGeneralBs: 'totales.totalGeneralBs',
    igtfUsd: 'totales.igtfUsd',
    igtfBs: 'totales.igtfBs',
  },
};

/**
 * Valores que puede traer la API para cada tipo (se comparan en mayúsculas
 * y sin tildes). Añade aquí los códigos reales de Dynamics.
 */
export const INVOICE_TYPE_ALIASES = {
  [INVOICE_TYPES.CREDITO]: ['CREDITO', 'CREDIT'],
  [INVOICE_TYPES.CONTADO]: ['CONTADO', 'CASH'],
};

/** Mayúsculas y sin tildes, para comparar textos de forma tolerante. */
const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .trim();

/** Busca a qué tipo corresponde un texto (coincidencia exacta o parcial). */
const matchInvoiceType = (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return null;
  const entry = Object.entries(INVOICE_TYPE_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => normalized === alias || normalized.startsWith(alias)),
  );
  return entry?.[0] ?? null;
};

/**
 * Determina el tipo de factura. Si la API no trae el campo de tipo, intenta
 * deducirlo de la condición de pago (p. ej. "CREDITO 07 DIAS").
 * @param {Object} raw
 * @returns {string|null}
 */
export const detectInvoiceType = (raw) =>
  matchInvoiceType(getValueByPath(raw, DYNAMICS_FIELD_MAP.invoiceType)) ??
  matchInvoiceType(getValueByPath(raw, DYNAMICS_FIELD_MAP.fields.pago));

/** Construye un objeto aplicando un mapa { claveInterna: rutaEnOrigen }. */
const pickByMap = (source, map) =>
  Object.fromEntries(Object.entries(map).map(([key, path]) => [key, getValueByPath(source, path)]));

/**
 * Traduce la respuesta de la API a InvoiceData.
 * @param {Object} raw JSON devuelto por la API.
 * @returns {import('@/domain/models/invoiceData').InvoiceData}
 */
export const mapDynamicsInvoice = (raw) => {
  const rawItems = getValueByPath(raw, DYNAMICS_FIELD_MAP.itemsPath);

  return {
    invoiceType: detectInvoiceType(raw),
    ...pickByMap(raw, DYNAMICS_FIELD_MAP.fields),
    items: Array.isArray(rawItems) ? rawItems.map((item) => pickByMap(item, DYNAMICS_FIELD_MAP.itemFields)) : [],
    totales: pickByMap(raw, DYNAMICS_FIELD_MAP.totals),
  };
};
