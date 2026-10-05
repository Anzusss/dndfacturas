/**
 * @file Modal que muestra el JSON completo de una plantilla.
 * Se cierra con el botón "Cerrar", con la tecla Escape o haciendo clic fuera.
 */

import { useEffect } from 'react';
import { FileCode2 } from 'lucide-react';

/**
 * @param {Object}     props
 * @param {Object}     props.template Plantilla a mostrar.
 * @param {() => void} props.onClose
 */
export const JsonViewerModal = ({ template, onClose }) => {
  // Cerrar con Escape.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation: los clics dentro del contenido no cierran el modal. */}
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={`JSON Schema de ${template.templateId}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-primary-600" />
            JSON Schema: {template.templateId}
          </h3>
          <button type="button" onClick={onClose} className="text-xs text-muted hover:text-neutral-900 transition">
            Cerrar
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <pre className="font-mono text-[11px] bg-neutral-50 p-4 rounded-lg text-neutral-900 border border-neutral-200 overflow-x-auto">
            {JSON.stringify(template, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
