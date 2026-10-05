/**
 * @file Notificación flotante en la esquina inferior derecha.
 * Se usa junto al hook `useToast`.
 */

import { AlertTriangle, CheckCircle2 } from 'lucide-react';

/** Estilo e icono de cada variante. */
const VARIANTS = {
  success: { className: 'bg-success-600', Icon: CheckCircle2 },
  error: { className: 'bg-error-600', Icon: AlertTriangle },
};

/**
 * @param {Object} props
 * @param {{message:string, variant?:'success'|'error'}|null} props.toast
 *   Toast a mostrar; si es `null` no se renderiza nada.
 */
export const Toast = ({ toast }) => {
  if (!toast) return null;

  const { className, Icon } = VARIANTS[toast.variant] ?? VARIANTS.success;

  return (
    <div
      role="status"
      className={`no-print fixed bottom-6 right-6 ${className} text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 text-xs font-semibold animate-fade-in-up z-50`}
    >
      <Icon className="w-4 h-4" />
      <span>{toast.message}</span>
    </div>
  );
};
