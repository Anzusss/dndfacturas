import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-200">
      <AlertCircle className="w-12 h-12 text-indigo-500 mb-4" />
      <h2 className="text-xl font-bold">Página no encontrada</h2>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">
        La ruta a la que intentas acceder no existe en la aplicación.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Editor</span>
      </Link>
    </div>
  );
};
