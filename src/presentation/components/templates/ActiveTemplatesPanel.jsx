/**
 * @file Panel "Plantilla activa por tipo de factura".
 *
 * Muestra qué versión se usa hoy para imprimir cada tipo. La gerente puede
 * cambiarla eligiendo entre las versiones APROBADAS de ese tipo.
 */

import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { INVOICE_TYPE_LABELS, INVOICE_TYPE_LIST } from '@/domain/constants/invoiceTypes';
import { TEMPLATE_STATUS, getTemplateKey } from '@/domain/models/templateLifecycle';

/**
 * @param {Object}   props
 * @param {Object[]} props.records     Todas las versiones de todas las plantillas.
 * @param {Object}   props.activeMap   { tipo: { templateId, version } }.
 * @param {boolean}  props.canActivate El usuario puede cambiar la plantilla activa.
 * @param {(template:Object) => void} props.onActivate
 */
export const ActiveTemplatesPanel = ({ records, activeMap, canActivate, onActivate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {INVOICE_TYPE_LIST.map((type) => {
      const ref = activeMap[type];
      const active = ref && records.find((r) => r.templateId === ref.templateId && r.version === ref.version);
      const candidates = records.filter((r) => r.invoiceType === type && r.status === TEMPLATE_STATUS.APPROVED);

      /** Activa la versión elegida en el selector (tras confirmar). */
      const handleChange = (event) => {
        const selected = candidates.find((r) => getTemplateKey(r) === event.target.value);
        const confirmed =
          selected &&
          window.confirm(
            `¿Usar "${selected.name}" v${selected.version} para imprimir las facturas de ${INVOICE_TYPE_LABELS[type]}?`,
          );
        if (confirmed) onActivate(selected);
      };

      return (
        <div key={type} className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-heading">Facturas de {INVOICE_TYPE_LABELS[type]}</h3>
            {active ? (
              <CheckCircle2 className="w-4 h-4 text-success-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning-600" />
            )}
          </div>

          <p className="text-xs text-muted">
            {active ? (
              <>
                Activa: <span className="font-semibold text-neutral-800">{active.name}</span>{' '}
                <span className="font-mono">v{active.version}</span>
              </>
            ) : (
              'Sin plantilla activa: no se pueden imprimir facturas de este tipo.'
            )}
          </p>

          {canActivate && (
            <select
              value={active ? getTemplateKey(active) : ''}
              onChange={handleChange}
              className="input-field input-field-sm w-full text-xs"
              aria-label={`Plantilla activa para ${INVOICE_TYPE_LABELS[type]}`}
            >
              {!active && <option value="">— Elegir plantilla aprobada —</option>}
              {candidates.map((r) => (
                <option key={getTemplateKey(r)} value={getTemplateKey(r)}>
                  {r.name} · v{r.version}
                </option>
              ))}
            </select>
          )}
        </div>
      );
    })}
  </div>
);
