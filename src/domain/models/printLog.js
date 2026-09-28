/**
 * @file Registros de auditoría (impresiones e historial de plantillas) y
 * sus reglas de filtrado.
 *
 * Capa: DOMINIO. Lógica pura sin dependencias de UI, reutilizable cuando la
 * consulta pase al backend (GET /invoices/audit).
 */

/** Estados posibles de un registro de impresión. */
export const PRINT_STATUS = {
  SUCCESS: 'SUCCESS', // Impresión de una factura real.
  TEST: 'TEST',       // Impresión de prueba lanzada desde el editor.
};

/** Id con el que se registran las impresiones de prueba del diseñador. */
export const TEST_PRINT_INVOICE_ID = 'PRUEBA-DISEÑO';

/**
 * Periodos de filtrado. Son periodos de calendario ("semana en curso",
 * "mes calendario"), tal como pide el roadmap.
 */
export const AUDIT_PERIODS = [
  { id: 'all', label: 'Todo' },
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta Semana' },
  { id: 'month', label: 'Este Mes' },
];

/**
 * Calcula el instante en que empieza un periodo de calendario.
 * - today: hoy a las 00:00.
 * - week:  lunes de la semana en curso a las 00:00.
 * - month: día 1 del mes en curso a las 00:00.
 *
 * @param {'all'|'today'|'week'|'month'} period
 * @param {Date} [now=new Date()]
 * @returns {Date|null} `null` cuando el periodo es "all" (sin límite).
 */
export const getPeriodStart = (period, now = new Date()) => {
  if (period === 'all') return null;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === 'week') {
    const daysSinceMonday = (start.getDay() + 6) % 7; // getDay(): 0 = domingo
    start.setDate(start.getDate() - daysSinceMonday);
  } else if (period === 'month') {
    start.setDate(1);
  }
  return start;
};

/**
 * Filtro genérico por texto y periodo, válido para cualquier registro de auditoría.
 *
 * @param {Object[]} records
 * @param {Object}   options
 * @param {string}   options.period       Id de AUDIT_PERIODS.
 * @param {string}   options.search       Texto a buscar.
 * @param {string}   options.dateField    Campo con la fecha ISO del registro.
 * @param {string[]} options.searchFields Campos en los que buscar el texto.
 * @returns {Object[]}
 */
export const filterAuditRecords = (records, { period, search, dateField, searchFields }) => {
  const term = search.trim().toLowerCase();
  const periodStart = getPeriodStart(period);

  return records.filter((record) => {
    // `?? ''` evita que un registro incompleto rompa la página.
    const matchesSearch =
      !term || searchFields.some((field) => String(record[field] ?? '').toLowerCase().includes(term));

    if (!matchesSearch) return false;
    return !periodStart || new Date(record[dateField]) >= periodStart;
  });
};

/** Filtra impresiones por factura/usuario y periodo. */
export const filterPrintLogs = (logs, { period, search }) =>
  filterAuditRecords(logs, { period, search, dateField: 'printedAt', searchFields: ['invoiceId', 'user'] });

/** Filtra el historial de plantillas por plantilla/usuario y periodo. */
export const filterTemplateHistory = (entries, { period, search }) =>
  filterAuditRecords(entries, {
    period,
    search,
    dateField: 'at',
    searchFields: ['templateId', 'templateName', 'user'],
  });
