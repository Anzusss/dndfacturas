import React from "react";
import packageJson from "@/../package.json";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto px-6 py-4 border-t border-border-subtle dark:border-white/5 bg-surface-card/60 dark:bg-slate-900/60 backdrop-blur-md text-xs text-on-surface-variant dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="font-bold text-on-surface dark:text-slate-200">
          © {new Date().getFullYear()} Grupo Serex - Admin Template.
        </span>
        <span className="hidden sm:inline opacity-50">•</span>
        <span className="text-[11px]">Todos los derechos reservados.</span>
      </div>

      <div className="flex items-center gap-4 font-semibold text-[11px]">
        <span className="flex items-center gap-1.5 text-emerald-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Versión {packageJson.version}
        </span>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Documentación
        </a>
        <a
          href="/settings/general"
          className="hover:text-primary transition-colors"
        >
          Soporte Técnico
        </a>
      </div>
    </footer>
  );
};
