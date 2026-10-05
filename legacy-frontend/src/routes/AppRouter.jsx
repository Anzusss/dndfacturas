/**
 * @file Enrutador de la aplicación en modo independiente.
 *
 * Monta las páginas (`featureRoutes`) dentro de `MainLayout`. Cuando la app
 * se integre en la plantilla de la empresa, este archivo dejará de usarse:
 * su router montará `featureRoutes` directamente (ver appRoutes.jsx).
 */

import { BrowserRouter, useRoutes } from 'react-router-dom';
import { MainLayout } from '@/presentation/layouts/MainLayout';
import { featureRoutes } from './appRoutes';
import { ROUTES } from './routePaths';

/** Árbol de rutas: layout mínimo + páginas. */
const AppRoutes = () => useRoutes([{ path: ROUTES.EDITOR, element: <MainLayout />, children: featureRoutes }]);

export const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
