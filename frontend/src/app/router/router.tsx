import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { canvasRoutes } from './canvasRoutes';

import {
  GuestRoute,
  ProtectedRoute,
  LoginPage,
  RecoverPasswordPage,
  LockScreenPage,
  SocialCallbackPage,
} from "@gruposerex/auth-module";

export const router = createBrowserRouter([
  // Rutas Públicas (Auth)
  {
    element: <GuestRoute />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/recover", element: <RecoverPasswordPage /> },
      { path: "/auth/lock", element: <LockScreenPage /> },
      { path: "/auth/callback/:provider", element: <SocialCallbackPage /> },
    ],
  },
  // Rutas Privadas
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <h1>Pagina Principal</h1>,
          },
          canvasRoutes,
        ],
      },
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [{ path: "*", element: <h1>Pagina No Encontrada</h1> }],
  },
]);
