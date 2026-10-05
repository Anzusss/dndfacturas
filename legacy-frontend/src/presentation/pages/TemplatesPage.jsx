/**
 * @file Página de plantillas (ruta "/templates").
 * - Plantilla activa por tipo de factura (la gerente la cambia).
 * - Listado de plantillas (última versión) con su flujo de aprobación.
 * - Crear, importar, exportar y abrir en el editor.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { createBlankInvoiceTemplate } from '@/domain/models/invoiceTemplate';
import { PERMISSIONS } from '@/domain/models/permissions';
import { ROUTES } from '@/routes/routePaths';
import { useToast } from '@/presentation/hooks/useToast';
import { useCurrentUser, usePermission } from '@/presentation/hooks/useCurrentUser';
import { useTemplateManagement } from '@/presentation/hooks/useTemplateManagement';
import { PageHeader } from '@/presentation/components/common/PageHeader';
import { Toast } from '@/presentation/components/common/Toast';
import { ActiveTemplatesPanel } from '@/presentation/components/templates/ActiveTemplatesPanel';
import { TemplateCard } from '@/presentation/components/templates/TemplateCard';
import { ImportTemplateButton } from '@/presentation/components/templates/ImportTemplateButton';
import { JsonViewerModal } from '@/presentation/components/templates/JsonViewerModal';

export const TemplatesPage = () => {
  const { toast, showToast } = useToast();
  const manager = useTemplateManagement(showToast);
  const [jsonTemplate, setJsonTemplate] = useState(null); // Plantilla cuyo JSON se está viendo.

  const user = useCurrentUser();
  const permissions = {
    canEdit: usePermission(PERMISSIONS.EDIT_TEMPLATES),
    canReview: usePermission(PERMISSIONS.REVIEW_TEMPLATES),
    canActivate: usePermission(PERMISSIONS.ACTIVATE_TEMPLATES),
    canTransfer: usePermission(PERMISSIONS.TRANSFER_TEMPLATES),
  };

  const setTemplate = useEditorStore((s) => s.setTemplate);
  const navigate = useNavigate();

  /** Carga la plantilla en el editor y navega a él. */
  const openInEditor = (template) => {
    setTemplate(template);
    navigate(ROUTES.EDITOR);
  };

  /** Versión activa de una plantilla (o null si no está activa). */
  const getActiveVersion = (template) => {
    const ref = manager.activeMap[template.invoiceType];
    return ref?.templateId === template.templateId ? ref.version : null;
  };

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          icon={Layers}
          title="Plantillas de Facturación"
          description="Diseños por tipo de factura, con aprobación y control de versiones."
          actions={
            <div className="flex items-center gap-2">
              {permissions.canTransfer && <ImportTemplateButton onImport={manager.importTemplate} />}
              {permissions.canEdit && (
                <button
                  type="button"
                  onClick={() => openInEditor(createBlankInvoiceTemplate(undefined, user.email))}
                  className="btn-primary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Plantilla</span>
                </button>
              )}
            </div>
          }
        />

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Plantilla activa por tipo de factura</h2>
          <ActiveTemplatesPanel
            records={manager.records}
            activeMap={manager.activeMap}
            canActivate={permissions.canActivate}
            onActivate={manager.activate}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Todas las plantillas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {manager.latest.map((template) => (
              <TemplateCard
                key={template.templateId}
                template={template}
                activeVersion={getActiveVersion(template)}
                permissions={permissions}
                actions={{
                  onOpen: openInEditor,
                  onViewJson: setJsonTemplate,
                  onExport: manager.exportTemplate,
                  onSubmit: manager.submit,
                  onApprove: manager.approve,
                  onReject: manager.reject,
                }}
              />
            ))}
          </div>
        </section>

        {jsonTemplate && <JsonViewerModal template={jsonTemplate} onClose={() => setJsonTemplate(null)} />}
      </div>

      <Toast toast={toast} />
    </div>
  );
};
