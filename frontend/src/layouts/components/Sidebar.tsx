import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { setSidebarOpen } from '@/app/store/slices/uiSlice';
import { NAVIGATION_MENU } from '@/layouts/config/navigationMenu';
import { clsx } from 'clsx';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarMenuItem } from './sidebar/SidebarMenuItem';

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  // State to track open state for parent accordion menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Auto-expand parent menu when navigating to child route
  useEffect(() => {
    NAVIGATION_MENU.forEach((parent) => {
      if (parent.children) {
        const hasActiveChild = parent.children.some((child) => child.to === location.pathname);
        if (hasActiveChild) {
          setOpenMenus((prev) => ({ ...prev, [parent.id]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container preserving original bg-[#132958] */}
      <aside
        id="main-sidebar"
        className={clsx(
          'fixed left-0 top-0 h-screen sidebar-transition bg-[#132958] flex flex-col z-50 shadow-2xl overflow-hidden text-white border-r border-white/10',
          sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-width',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <SidebarHeader />

        {/* Scrollable Nav List generated from NAVIGATION_MENU config */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 custom-scrollbar overflow-y-auto overflow-x-hidden">
          {NAVIGATION_MENU.map((item) => (
            <SidebarMenuItem 
              key={item.id} 
              item={item} 
              isOpen={!!openMenus[item.id]} 
              toggleMenu={toggleMenu} 
            />
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
};
