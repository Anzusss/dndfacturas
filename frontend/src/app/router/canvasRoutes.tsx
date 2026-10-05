import { MainLayout as CanvasLayout } from '@/presentation/layouts/MainLayout';
import { AuditPage } from '@/presentation/pages/AuditPage';
import { EditorPage } from '@/presentation/pages/EditorPage';
import { NotFoundPage } from '@/presentation/pages/NotFoundPage';
import { PrintPage } from '@/presentation/pages/PrintPage';
import { PrintDetailsPage } from '@/presentation/pages/PrintDetailsPage';
import { TemplatesPage } from '@/presentation/pages/TemplatesPage';

export const canvasRoutes = {
  path: 'facturacion',
  element: <CanvasLayout />,
  children: [
    { index: true, element: <EditorPage /> },
    { path: 'print', element: <PrintPage /> },
    { path: 'print/json', element: <PrintDetailsPage /> },
    { path: 'print/:invoiceNumber', element: <PrintDetailsPage /> },
    { path: 'templates', element: <TemplatesPage /> },
    { path: 'audit', element: <AuditPage /> },
    { path: '*', element: <NotFoundPage /> },
  ],
};