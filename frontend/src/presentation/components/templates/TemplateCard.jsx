/**
 * @file Tarjeta de una plantilla (su última versión) con las acciones que
 * permiten su estado y el rol del usuario.
 */

import { ArrowRight, Check, Download, FileCode2, Send, Star, X } from 'lucide-react';
import { TEMPLATE_STATUS } from '@/domain/models/templateLifecycle';
import { INVOICE_TYPE_LABELS } from '@/domain/constants/invoiceTypes';
import { describePaper } from '@/domain/constants/paperSizes';
import { InvoiceTypeBadge, TemplateStatusBadge } from '@/presentation/components/common/StatusBadges';

/** Botón de acción pequeño con icono. */
const ActionButton = ({ icon: Icon, label, onClick, variant = 'ghost' }) => {
  const variants = {
    ghost: 'text-muted hover:text-primary-600',
    success: 'text-success-700 hover:text-success-600 font-semibold',
    danger: 'text-error-600 hover:text-error-500',
  };
  return (
    <button type="button" onClick={onClick} className={`text-xs flex items-center gap-1 transition ${variants[variant]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

/**
 * @param {Object}   props
 * @param {Object}   props.template      Última versión de la plantilla.
 * @param {number|null} props.activeVersion Versión activa de esta plantilla (si alguna lo está).
 * @param {{canEdit:boolean, canReview:boolean, canTransfer:boolean}} props.permissions
 * @param {Object}   props.actions       Callbacks: onOpen, onViewJson, onExport, onSubmit, onApprove, onReject.
 */
export const TemplateCard = ({ template, activeVersion, permissions, actions }) => {
  const { pageSetup, status } = template;

  /** Datos resumidos de la tarjeta. */
  const details = [
    { label: 'Hoja', value: describePaper(pageSetup) },
    { label: 'Margen Superior', value: pageSetup.paddingTop },
    { label: 'Margen Inferior', value: pageSetup.paddingBottom },
    { label: 'Bloques', value: template.elements.length },
    { label: 'Última modificación', value: template.updatedBy ?? '—' },
  ];

  return (
    <div className="card card-hover p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-heading truncate">{template.name}</h3>
          <p className="text-[11px] font-mono text-primary-600 mt-0.5">
            {template.templateId} · v{template.version}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <InvoiceTypeBadge invoiceType={template.invoiceType} />
          <TemplateStatusBadge status={status} />
        </div>
      </div>

      {activeVersion !== null && (
        <p className="text-[11px] text-success-700 flex items-center gap-1 font-medium">
          <Star className="w-3.5 h-3.5 fill-current" />
          v{activeVersion} activa para {INVOICE_TYPE_LABELS[template.invoiceType]}
          {activeVersion !== template.version && ' (esta versión aún no)'}
        </p>
      )}

      {status === TEMPLATE_STATUS.DRAFT && template.reviewComment && (
        <p className="text-[11px] text-error-600">Rechazada: {template.reviewComment}</p>
      )}

      <ul className="text-xs text-muted space-y-1">
        {details.map(({ label, value }) => (
          <li key={label}>
            • {label}: <span className="font-mono text-neutral-700">{value}</span>
          </li>
        ))}
      </ul>

      {/* Acciones del flujo según estado y rol */}
      {(permissions.canEdit && status === TEMPLATE_STATUS.DRAFT) ||
      (permissions.canReview && status === TEMPLATE_STATUS.IN_REVIEW) ? (
        <div className="flex items-center gap-4 pt-1">
          {permissions.canEdit && status === TEMPLATE_STATUS.DRAFT && (
            <ActionButton icon={Send} label="Enviar a revisión" onClick={() => actions.onSubmit(template)} />
          )}
          {permissions.canReview && status === TEMPLATE_STATUS.IN_REVIEW && (
            <>
              <ActionButton icon={Check} label="Aprobar" variant="success" onClick={() => actions.onApprove(template)} />
              <ActionButton icon={X} label="Rechazar" variant="danger" onClick={() => actions.onReject(template)} />
            </>
          )}
        </div>
      ) : null}

      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ActionButton icon={FileCode2} label="JSON" onClick={() => actions.onViewJson(template)} />
          {permissions.canTransfer && (
            <ActionButton icon={Download} label="Exportar" onClick={() => actions.onExport(template)} />
          )}
        </div>

        <button
          type="button"
          onClick={() => actions.onOpen(template)}
          className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Abrir en Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
