import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/app/store/slices/authSlice";

interface HeaderProfileMenuProps {
  user: any;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const HeaderProfileMenu: React.FC<HeaderProfileMenuProps> = ({ user, isOpen, onToggle, onClose }) => {
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={onToggle}
        className="flex items-center gap-2.5 pl-2 border-l border-border-subtle/80 cursor-pointer group hover:opacity-90 transition-opacity"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002975] to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center border-2 border-primary/20 shadow-sm group-hover:border-primary transition-all">
            RM
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface glow-success" />
        </div>
        <div className="hidden lg:flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-on-surface leading-tight">
              {user?.name || "Roberto M."}
            </span>
            <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-primary transition-colors">
              expand_more
            </span>
          </div>
          <span className="text-[10px] font-semibold text-primary">
            {user?.role || "Super Admin"}
          </span>
        </div>
      </div>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-16 w-72 glass-modal rounded-3xl shadow-2xl border border-border-subtle p-4 space-y-3 animate-scale-in z-[150]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-border-subtle">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#002975] to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              RM
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-extrabold text-on-surface truncate">
                {user?.name || "Roberto Martinez"}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "roberto@serex.com"}
              </p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                Super Admin Nivel 5
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <Link
              to="/forms/simple"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-on-surface hover:bg-primary/10 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg text-primary">
                manage_accounts
              </span>
              Mi Perfil & Seguridad
            </Link>
            <Link
              to="/auth/lock-screen"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-on-surface hover:bg-primary/10 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg text-primary">
                lock
              </span>
              Bloquear Pantalla
            </Link>
          </div>

          <div className="pt-2 border-t border-border-subtle">
            <button
              onClick={() => {
                onClose();
                dispatch(logout());
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-rose-600 hover:bg-rose-500/10 transition-all text-left"
            >
              <span className="material-symbols-outlined text-lg">
                logout
              </span>
              Cerrar Sesión Segura
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
