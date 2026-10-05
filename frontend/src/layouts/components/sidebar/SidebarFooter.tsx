import React, { useState, useEffect } from "react";

export const SidebarFooter: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="p-4 border-t border-white/10 bg-white/5 text-[11px] text-blue-200/70 font-semibold flex items-center gap-2 sidebar-footer transition-colors duration-300">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isOnline
            ? "bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]"
            : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
        }`}
      ></span>
      <span className="whitespace-nowrap">
        <span className={isOnline ? "" : "text-rose-400"}>
          Servidor {isOnline ? "En Línea" : "Fuera de Línea"}
        </span>
      </span>
    </div>
  );
};
