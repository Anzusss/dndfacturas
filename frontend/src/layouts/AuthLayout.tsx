import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/90 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Outlet />
      </div>
    </div>
  );
};
