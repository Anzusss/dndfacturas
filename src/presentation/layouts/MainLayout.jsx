import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout minimalista que proporciona el punto de anclaje (<Outlet />)
 * para acoplar directamente el editor Canva a la futura plantilla empresarial.
 */
export const MainLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <Outlet />
    </div>
  );
};
