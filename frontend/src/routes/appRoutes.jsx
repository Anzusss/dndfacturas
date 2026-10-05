/**
 * @file Definición de las páginas de dndFacturas como objetos de ruta.
 *
 * INTEGRACIÓN con la plantilla de la empresa: su router puede montar
 * `featureRoutes` como hijas de su propio layout, por ejemplo:
 *
 *   { path: '/facturacion', element: <LayoutEmpresa />, children: featureRoutes }
 *
 * (en ese caso habría que ajustar ROUTES para que incluyan el prefijo).
 */

import { EditorPage } from '@/presentation/pages/EditorPage';
import { PrintPage } from '@/presentation/pages/PrintPage';
import { TemplatesPage } from '@/presentation/pages/TemplatesPage';
import { AuditPage } from '@/presentation/pages/AuditPage';
import { NotFoundPage } from '@/presentation/pages/NotFoundPage';
import { ROUTES } from './routePaths';

/** Páginas de la funcionalidad, sin layout. */
export const featureRoutes = [
  { index: true, element: <EditorPage /> },
  { path: ROUTES.PRINT, element: <PrintPage /> },
  { path: ROUTES.TEMPLATES, element: <TemplatesPage /> },
  { path: ROUTES.AUDIT, element: <AuditPage /> },
  { path: '*', element: <NotFoundPage /> },
];
