import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout minimalista que proporciona el punto de anclaje (<Outlet />)
 * para acoplar directamente el editor Canva a la futura plantilla empresarial.
 */
export const MainLayout = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-neutral-50 text-neutral-900 overflow-hidden">
      <Outlet />
    </div>
  );
};
