import React, { useEffect, useState } from 'react';
import { auditService } from '@/services/auditService';
import { History, Filter, Printer, Calendar, User, Search } from 'lucide-react';

export const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    auditService.getPrintLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterPeriod === 'all') return true;

    const logDate = new Date(log.printedAt);
    const now = new Date();
    const diffHours = (now - logDate) / (1000 * 60 * 60);

    if (filterPeriod === 'today') return diffHours <= 24;
    if (filterPeriod === 'week') return diffHours <= 24 * 7;
    if (filterPeriod === 'month') return diffHours <= 24 * 30;

    return true;
  });

  return (
    <div className="flex-1 p-8 bg-neutral-50 text-neutral-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-heading flex items-center gap-2">
              <History className="w-5 h-5 text-primary-600" />
              Auditoría y Control de Impresión
            </h1>
            <p className="text-xs text-muted mt-1">
              Registro histórico de cada documento impreso sobre papel membretado para cumplimiento fiscal.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg text-xs shadow-sm">
            <Printer className="w-4 h-4 text-success-600" />
            <span className="text-neutral-700 font-semibold">{logs.length}</span>
            <span className="text-muted">impresiones registradas</span>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-subtle" />
            <input
              type="text"
              placeholder="Buscar por Factura No. o Usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field input-field-sm w-64"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-subtle" />
            <span className="text-xs text-muted">Rango:</span>
            {['all', 'today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 text-xs rounded-lg capitalize transition ${
                  filterPeriod === period
                    ? 'bg-primary-600 text-white font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {period === 'all' ? 'Todo' : period === 'today' ? 'Hoy (24h)' : period === 'week' ? 'Esta Semana' : 'Este Mes'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Registros */}
        <div className="table-container">
          <table className="w-full text-xs text-left">
            <thead className="table-header">
              <tr>
                <th className="p-3">ID Registro</th>
                <th className="p-3">Factura No.</th>
                <th className="p-3">Plantilla</th>
                <th className="p-3">Usuario Auditor</th>
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3 text-center">Copias</th>
                <th className="p-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">
                    No se encontraron registros de impresión con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="table-row">
                    <td className="p-3 text-muted">{log.id}</td>
                    <td className="p-3 font-semibold text-primary-600">{log.invoiceId}</td>
                    <td className="p-3 text-neutral-700">{log.templateId}</td>
                    <td className="p-3 text-neutral-600 font-sans flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-subtle" />
                      {log.user}
                    </td>
                    <td className="p-3 text-neutral-600 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-subtle" />
                        {new Date(log.printedAt).toLocaleString('es-VE')}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-neutral-900">{log.copies}</td>
                    <td className="p-3 text-right">
                      <span className="badge badge-success">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
