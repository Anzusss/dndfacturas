/**
 * @file Hook para notificaciones temporales (toast).
 *
 * Corrige dos problemas de la versión anterior (dentro de EditorPage):
 * - Si se guardaba dos veces seguidas, el primer temporizador ocultaba el
 *   segundo mensaje antes de tiempo.
 * - El temporizador seguía vivo si se abandonaba la página.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param {number} [duration=3000] Milisegundos que permanece visible.
 * @returns {{
 *   toast: {message:string, variant:'success'|'error'}|null,
 *   showToast: (message:string, variant?:'success'|'error') => void
 * }}
 */
export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback(
    (message, variant = 'success') => {
      clearTimeout(timeoutRef.current); // Reinicia el contador si ya había un toast.
      setToast({ message, variant });
      timeoutRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  // Limpia el temporizador al desmontar el componente.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return { toast, showToast };
};
