/**
 * @file Bloque derecho de la cabecera: rol simulado, Restaurar,
 * Guardar y Probar Impresión.
 * Restaurar y Guardar solo se habilitan para borradores y usuarios con permiso.
 */

import { Printer, Save, RotateCw } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { selectIsEditable } from '@/store/editorSelectors';
import { PERMISSIONS } from '@/domain/models/permissions';
import { useEditorTestPrint } from '@/presentation/hooks/useEditorTestPrint';
import { usePermission } from '@/presentation/hooks/useCurrentUser';

/**
 * @param {Object} props
 * @param {() => void} props.onSave
 */
export const EditorActions = ({ onSave }) => {
  const resetToDefault = useEditorStore((s) => s.resetToDefault);
  const editable = useEditorStore(selectIsEditable);
  const canEdit = usePermission(PERMISSIONS.EDIT_TEMPLATES) && editable;
  const handleTestPrint = useEditorTestPrint();

  /** Pide confirmación antes de descartar el diseño actual. */
  const handleReset = () => {
    if (window.confirm('¿Deseas restaurar el diseño base de este tamaño de hoja? Se perderán los bloques actuales.')) {
      resetToDefault();
    }
  };

  return (
    <div className="flex items-center space-x-2 shrink-0">
      <button
        type="button"
        onClick={handleReset}
        disabled={!canEdit}
        className="btn-secondary px-2.5 py-1.5 text-xs font-medium flex items-center gap-1.5 disabled:opacity-40"
        title="Restaurar el diseño base del tamaño de hoja actual"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span className="hidden 2xl:inline">Restaurar</span>
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={!canEdit}
        className="btn-primary px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 disabled:opacity-40"
      >
        <Save className="w-3.5 h-3.5" />
        <span>Guardar</span>
      </button>

      <button
        type="button"
        onClick={handleTestPrint}
        className="btn-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
        title="Imprime el diseño con la factura de ejemplo"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Probar Impresión</span>
      </button>
    </div>
  );
};
