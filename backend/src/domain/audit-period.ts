/**
 * @file Periodos de calendario para filtrar la auditoría
 * (espejo de getPeriodStart en printLog.js del frontend).
 *
 * Capa: DOMINIO.
 */

export const AUDIT_PERIODS = ['all', 'today', 'week', 'month'] as const;
export type AuditPeriod = (typeof AUDIT_PERIODS)[number];

/**
 * Inicio del periodo de calendario:
 * - today: hoy 00:00 · week: lunes 00:00 · month: día 1 a las 00:00.
 *
 * @param period
 * @param now Fecha de referencia (inyectable para pruebas).
 * @returns `null` para "all" (sin límite).
 */
export const getPeriodStart = (period: AuditPeriod, now: Date = new Date()): Date | null => {
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
