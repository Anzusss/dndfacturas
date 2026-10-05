import React from "react";

interface NotificationItemProps {
  notif: {
    id: string;
    type: string;
    title: string;
    message: string;
  };
  onRemove: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notif, onRemove }) => {
  return (
    <div className="relative p-4 rounded-2xl bg-surface-container-low border border-border-subtle hover:border-primary/30 transition-colors group">
      <button
        onClick={() => onRemove(notif.id)}
        className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-surface-container flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        title="Eliminar notificación"
      >
        <span className="material-symbols-outlined text-[14px] text-slate-400 hover:text-rose-500">
          close
        </span>
      </button>
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
            notif.type === "success"
              ? "bg-emerald-500/10 text-emerald-600"
              : notif.type === "error"
                ? "bg-rose-500/10 text-rose-600"
                : notif.type === "warning"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-sky-500/10 text-sky-600"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {notif.type === "success"
              ? "check_circle"
              : notif.type === "error"
                ? "error"
                : notif.type === "warning"
                  ? "warning"
                  : "info"}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface pr-6">
            {notif.title}
          </h4>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {notif.message}
          </p>
        </div>
      </div>
    </div>
  );
};
