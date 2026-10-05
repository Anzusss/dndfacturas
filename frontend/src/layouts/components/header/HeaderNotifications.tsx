import React, { useState } from "react";
import { NotificationItem } from "./NotificationItem";

interface HeaderNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({
  isOpen,
  onClose,
}) => {
  // Dummy data just for the panel UI preview (so it doesn't trigger global toasts)
  const [dummyNotifications, setDummyNotifications] = useState([
    {
      id: "1",
      type: "success",
      title: "Sistema Actualizado",
      message:
        "Se ha desplegado la versión v2.4 con éxito en el servidor AWS-East.",
    },
    {
      id: "2",
      type: "warning",
      title: "Uso de Memoria Alto",
      message: "El clúster principal alcanzó el 85% de capacidad de RAM.",
    },
    {
      id: "3",
      type: "info",
      title: "Campaña Finalizada",
      message: "La campaña de E-Commerce de verano ha concluido.",
    },
    {
      id: "4",
      type: "error",
      title: "Fallo de Sincronización",
      message: "No se pudo conectar con la pasarela de pagos externa.",
    },
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[130] bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-surface-card h-full flex flex-col shadow-2xl border-l border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-border-subtle dark:border-slate-700/50 flex justify-between items-center bg-surface-container-low dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-2xl">
              notifications_active
            </span>
            <h3 className="text-base font-extrabold text-on-surface dark:text-slate-200">
              Notificaciones
            </h3>
            {dummyNotifications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                {dummyNotifications.length} nuevas
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400">
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {dummyNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">
                notifications_paused
              </span>
              <p className="text-sm font-semibold text-on-surface">
                No tienes notificaciones
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Estás al día con todo.
              </p>
            </div>
          ) : (
            dummyNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onRemove={(id) =>
                  setDummyNotifications((prev) =>
                    prev.filter((n) => n.id !== id),
                  )
                }
              />
            ))
          )}
        </div>

        {dummyNotifications.length > 0 && (
          <div className="p-4 border-t border-border-subtle dark:border-slate-700/50 bg-surface-container-low dark:bg-slate-800/80">
            <button
              onClick={() => setDummyNotifications([])}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-primary dark:text-inverse-primary bg-primary/10 dark:bg-primary-light/20 hover:bg-primary/20 dark:hover:bg-primary-light/30 transition-colors"
            >
              Marcar todas como leídas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
