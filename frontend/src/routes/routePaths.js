/**
 * @file Rutas de la aplicación.
 *
 * Centralizar las rutas evita strings repetidos ('/', '/audit'…) en enlaces
 * y navegaciones; si una ruta cambia, se cambia solo aquí.
 */
export const ROUTES = {
  EDITOR: '/facturacion',
  PRINT: '/facturacion/print',
  TEMPLATES: '/facturacion/templates',
  AUDIT: '/facturacion/audit',
};
