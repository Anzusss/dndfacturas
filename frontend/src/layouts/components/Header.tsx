import React, { useState } from "react";
import { Link, useLocation, useMatches } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  toggleSidebar,
  toggleSidebarCollapsed,
  setTheme,
} from "@/app/store/slices/uiSlice";

import { HeaderSearchModal } from "./header/HeaderSearchModal";
import { HeaderNotifications } from "./header/HeaderNotifications";
import { HeaderProfileMenu } from "./header/HeaderProfileMenu";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const matches = useMatches();

  const { theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Compute page title dynamically from matched routes
  const getPageTitle = () => {
    const currentMatch = matches[matches.length - 1];
    const title = (currentMatch?.handle as any)?.title;
    return title || "Grupo Serex Admin";
  };

  return (
    <>
      <header className="flex justify-between items-center h-16 px-6 sm:px-8 glass-header border-b border-border-subtle/80 sticky top-0 z-40 shadow-sm transition-all duration-300">
        {/* Left Side: Mobile Menu Button & Breadcrumb Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors lg:hidden"
            title="Alternar Menú Sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <button
            onClick={() => dispatch(toggleSidebarCollapsed())}
            className="hidden lg:flex p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Colapsar sidebar"
          >
            <span className="material-symbols-outlined text-xl">menu_open</span>
          </button>

          <div className="hidden md:flex flex-col justify-center min-w-0 flex-1">
            <nav
              id="global-breadcrumb"
              className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium truncate"
            >
              <Link
                to="/dashboards/analytics"
                className="hover:text-primary transition-colors flex items-center gap-1 group shrink-0"
              >
                <span className="material-symbols-outlined text-[14px] text-primary/80 group-hover:scale-110 transition-transform">
                  home
                </span>
                <span className="font-semibold">Inicio</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <span className="text-base font-bold text-primary leading-tight tracking-tight truncate">
                {getPageTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Actions Bar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
            title="Buscar"
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
          </button>

          {/* Command Palette Trigger (Desktop) */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-surface-card/90 dark:bg-slate-800/80 border border-border-subtle/90 dark:border-white/10 hover:border-primary/40 text-on-surface-variant dark:text-slate-300 hover:text-on-surface dark:hover:text-white text-xs shadow-sm hover:shadow-md transition-all group"
          >
            <span className="material-symbols-outlined text-[18px] text-primary/70 group-hover:text-primary transition-colors">
              search
            </span>
            <span className="font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">
              Buscar módulo o comando...
            </span>
            <kbd className="ml-4 text-[10px] font-semibold bg-surface-container/80 dark:bg-slate-700/80 text-primary dark:text-inverse-primary px-2 py-0.5 rounded-md border border-border-subtle dark:border-slate-600 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={() =>
              dispatch(setTheme(theme === "dark" ? "light" : "dark"))
            }
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
            title="Cambiar Tema (Claro / Oscuro)"
          >
            <span className="material-symbols-outlined text-[22px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative group">
            <button
              onClick={() => setNotificationsOpen(true)}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative"
            >
              <span className="material-symbols-outlined text-[22px]">
                notifications
              </span>
              {/* Optional unread badge could go here if managed globally */}
            </button>
          </div>

          {/* User Profile Component */}
          <HeaderProfileMenu
            user={user}
            isOpen={profileMenuOpen}
            onToggle={() => setProfileMenuOpen(!profileMenuOpen)}
            onClose={() => setProfileMenuOpen(false)}
          />
        </div>
      </header>

      <HeaderSearchModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <HeaderNotifications
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
};
