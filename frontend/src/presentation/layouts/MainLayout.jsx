/**
 * @file Layout raíz. Se mantiene intencionadamente mínimo: su `<Outlet />`
 * es el punto de anclaje para acoplar el editor dentro de la futura
 * aplicación/plantilla empresarial sin arrastrar estilos propios.
 */

import { Outlet } from 'react-router-dom';
import '../../canvas.css';

export const MainLayout = () => (
  <div className="w-full h-full min-h-0 flex flex-col bg-neutral-50 text-neutral-900 overflow-hidden">
    <Outlet />
  </div>
);
