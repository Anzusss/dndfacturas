/**
 * @file Barra bajo la cabecera del editor con el estado de la plantilla
 * abierta (tipo, versión, estado) y la acción que corresponde:
 * - Borrador   → "Enviar a revisión" (guarda y envía).
 * - En revisión → aviso de solo lectura.
 * - Aprobada   → "Crear nueva versión" (borrador editable; la aprobada no cambia).
 */

import { useState } from 'react';
import { GitBranchPlus, Lock, MessageSquareWarning, Send } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { TEMPLATE_STATUS } from '@/domain/models/templateLifecycle';
import { PERMISSIONS } from '@/domain/models/permissions';
import { templateWorkflowService } from '@/services/templateWorkflowService';
import { useCurrentUser, usePermission } from '@/presentation/hooks/useCurrentUser';
import { InvoiceTypeBadge, TemplateStatusBadge } from '@/presentation/components/common/StatusBadges';

/**
 * @param {Object} props
 * @param {(message:string, variant?:'success'|'error') => void} props.onNotify Muestra un toast.
 */
export const TemplateStatusBar = ({ onNotify }) => {
  const template = useEditorStore((s) => s.template);
  const setTemplate = useEditorStore((s) => s.setTemplate);
  const user = useCurrentUser();
  const canEdit = usePermission(PERMISSIONS.EDIT_TEMPLATES);
  const [busy, setBusy] = useState(false);

  /** Ejecuta una acción asíncrona mostrando el resultado o el error. */
  const run = async (action, successMessage) => {
    setBusy(true);
    try {
      const updated = await action();
      setTemplate(updated);
      onNotify(typeof successMessage === 'function' ? successMessage(updated) : successMessage);
    } catch (error) {
      onNotify(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  /** Guarda el borrador actual y lo envía a revisión. */
  const handleSubmit = () =>
    run(async () => {
      const saved = await templateWorkflowService.saveDraft(template, user);
      return templateWorkflowService.submitForReview(saved, user);
    }, 'Plantilla enviada a revisión.');

  /** Prepara la siguiente versión como borrador (se guarda al pulsar "Guardar"). */
  const handleNewVersion = () =>
    run(
      () => templateWorkflowService.prepareNextVersion(template, user),
      (next) => `Versión ${next.version} creada como borrador. Pulsa "Guardar" para conservarla.`,
    );

  const { status } = template;

  return (
    <div className="no-print h-10 shrink-0 bg-neutral-50 border-b border-neutral-200 px-4 flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 min-w-0">
        <InvoiceTypeBadge invoiceType={template.invoiceType} />
        <span className="font-mono text-neutral-500">v{template.version}</span>
        <TemplateStatusBadge status={status} />

        {/* Motivo del rechazo, para que el diseñador sepa qué corregir. */}
        {status === TEMPLATE_STATUS.DRAFT && template.reviewComment && (
          <span className="flex items-center gap-1 text-error-600 truncate" title={template.reviewComment}>
            <MessageSquareWarning className="w-3.5 h-3.5 shrink-0" />
            Rechazada: {template.reviewComment}
          </span>
        )}
        {status === TEMPLATE_STATUS.IN_REVIEW && (
          <span className="flex items-center gap-1 text-warning-600">
            <Lock className="w-3.5 h-3.5" />
            Solo lectura: pendiente de aprobación en «Plantillas».
          </span>
        )}
        {status === TEMPLATE_STATUS.APPROVED && (
          <span className="flex items-center gap-1 text-neutral-500">
            <Lock className="w-3.5 h-3.5" />
            Versión aprobada: no se modifica.
          </span>
        )}
      </div>

      {canEdit && status === TEMPLATE_STATUS.DRAFT && (
        <button
          type="button"
          disabled={busy}
          onClick={handleSubmit}
          className="btn-secondary px-2.5 py-1 text-xs flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          Enviar a revisión
        </button>
      )}
      {canEdit && status === TEMPLATE_STATUS.APPROVED && (
        <button
          type="button"
          disabled={busy}
          onClick={handleNewVersion}
          className="btn-primary px-2.5 py-1 text-xs flex items-center gap-1.5 shrink-0"
        >
          <GitBranchPlus className="w-3.5 h-3.5" />
          Crear nueva versión
        </button>
      )}
    </div>
  );
};
