/**
 * @file Página 404 para rutas inexistentes.
 */

import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/routes/routePaths';

export const NotFoundPage = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50 text-neutral-900">
    <div className="card p-8 max-w-md w-full space-y-4">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-primary-600" />
      </div>
      <h2 className="text-xl font-bold text-heading">Página no encontrada</h2>
      <p className="text-sm text-muted">La ruta a la que intentas acceder no existe en la aplicación.</p>
      <Link
        to={ROUTES.EDITOR}
        className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Editor</span>
      </Link>
    </div>
  </div>
);
