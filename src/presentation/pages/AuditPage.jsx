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
    <div className="flex-1 p-8 bg-slate-950 text-slate-100 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Auditoría y Control de Impresión
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Registro histórico de cada documento impreso sobre papel membretado para cumplimiento fiscal.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">{logs.length}</span>
            <span className="text-slate-500">impresiones registradas</span>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Factura No. o Usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 w-64 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Rango:</span>
            {['all', 'today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 text-xs rounded-lg capitalize transition ${
                  filterPeriod === period
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {period === 'all' ? 'Todo' : period === 'today' ? 'Hoy (24h)' : period === 'week' ? 'Esta Semana' : 'Este Mes'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Registros */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No se encontraron registros de impresión con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 text-slate-400">{log.id}</td>
                    <td className="p-3 font-semibold text-indigo-300">{log.invoiceId}</td>
                    <td className="p-3 text-slate-300">{log.templateId}</td>
                    <td className="p-3 text-slate-400 font-sans flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {log.user}
                    </td>
                    <td className="p-3 text-slate-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(log.printedAt).toLocaleString('es-VE')}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-200">{log.copies}</td>
                    <td className="p-3 text-right">
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px] font-sans font-medium">
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
