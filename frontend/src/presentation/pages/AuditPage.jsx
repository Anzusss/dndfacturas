/**
 * @file Página de auditoría (ruta "/audit") con dos vistas:
 * - Impresiones: cada factura impresa, con la plantilla y versión usadas.
 * - Cambios de plantillas: quién creó, editó, aprobó o activó cada versión.
 * Ambas comparten la búsqueda y el filtro por periodo.
 */

import { useEffect, useMemo, useState } from 'react';
import { History, Printer } from 'lucide-react';
import { auditService } from '@/services/auditService';
import { templateHistoryService } from '@/services/templateHistoryService';
import { filterPrintLogs, filterTemplateHistory } from '@/domain/models/printLog';
import { PageHeader } from '@/presentation/components/common/PageHeader';
import { SegmentedTabs } from '@/presentation/components/common/SegmentedTabs';
import { AuditFilters } from '@/presentation/components/audit/AuditFilters';
import { AuditLogTable } from '@/presentation/components/audit/AuditLogTable';
import { TemplateHistoryTable } from '@/presentation/components/audit/TemplateHistoryTable';

/** Vistas disponibles. */
const TABS = [
  { id: 'prints', label: 'Impresiones' },
  { id: 'history', label: 'Cambios de plantillas' },
];

export const AuditPage = () => {
  const [tab, setTab] = useState('prints');
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [period, setPeriod] = useState('all');
  const [search, setSearch] = useState('');

  // Carga inicial. `cancelled` evita actualizar el estado si se sale de la
  // página antes de que terminen las peticiones.
  useEffect(() => {
    let cancelled = false;
    Promise.all([auditService.getPrintLogs(), templateHistoryService.getHistory()]).then(([printLogs, entries]) => {
      if (cancelled) return;
      setLogs(printLogs);
      setHistory(entries);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredLogs = useMemo(() => filterPrintLogs(logs, { period, search }), [logs, period, search]);
  const filteredHistory = useMemo(
    () => filterTemplateHistory(history, { period, search }),
    [history, period, search],
  );

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          icon={History}
          title="Auditoría"
          description="Registro de impresiones sobre papel membretado y de cambios en las plantillas."
          actions={
            <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <Printer className="w-4 h-4 text-success-600" />
              <span className="text-neutral-700 font-semibold">{logs.length}</span>
              <span className="text-muted">impresiones registradas</span>
            </div>
          }
        />

        <SegmentedTabs tabs={TABS} activeTab={tab} onSelect={setTab} className="w-fit text-xs" />

        <AuditFilters
          search={search}
          onSearchChange={setSearch}
          period={period}
          onPeriodChange={setPeriod}
          placeholder={tab === 'prints' ? 'Buscar por Factura No. o Usuario...' : 'Buscar por plantilla o usuario...'}
        />

        {tab === 'prints' ? <AuditLogTable logs={filteredLogs} /> : <TemplateHistoryTable entries={filteredHistory} />}
      </div>
    </div>
  );
};
