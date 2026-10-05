import React from "react";
import { useDispatch } from "react-redux";
import { toggleSidebarCollapsed } from "@/app/store/slices/uiSlice";

export const SidebarHeader: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="p-5 flex items-center justify-between border-b border-white/10 shrink-0 bg-white/5">
      <div className="flex items-center gap-3">
        <div
          onClick={() => {
            if (window.innerWidth >= 1024) {
              dispatch(toggleSidebarCollapsed());
            }
          }}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center shrink-0 lg:cursor-pointer transition-all duration-300 hover:scale-105 shadow-md glow-primary"
          title="Expandir / Colapsar Menú"
        >
          <span
            className="material-symbols-outlined text-white text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            widgets
          </span>
        </div>
        <div className="flex flex-col overflow-hidden logo-text">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-extrabold tracking-tight text-white leading-tight truncate">
              Grupo Serex
            </span>
          </div>
          <span className="text-[10px] font-medium text-blue-200/70 uppercase tracking-wider">
            Admin Portal {new Date().getFullYear()}
          </span>
        </div>
      </div>
      <button
        onClick={() => dispatch(toggleSidebarCollapsed())}
        className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors logo-text hidden lg:flex"
        title="Colapsar sidebar"
      >
        <span className="material-symbols-outlined text-white/70 hover:text-white text-lg">
          menu_open
        </span>
      </button>
    </div>
  );
};
