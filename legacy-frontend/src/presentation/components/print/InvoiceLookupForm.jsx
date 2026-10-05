/**
 * @file Formulario de búsqueda de factura por número, con opción de pegar
 * el JSON a mano para probar sin API.
 */

import { useState } from 'react';
import { ClipboardPaste, Search, Loader2 } from 'lucide-react';
import { INVOICE_API_MODE, MOCK_INVOICE_NUMBERS } from '@/services/invoiceApi/invoiceApiService';

/** Texto de la insignia según de dónde salen las facturas. */
const API_MODE_LABELS = { backend: 'Vía backend', api: 'API directa', mock: 'API simulada' };

/**
 * @param {Object}  props
 * @param {boolean} props.loading
 * @param {(invoiceNumber:string) => void} props.onSearch
 * @param {(jsonText:string) => void} props.onLoadJson
 */
export const InvoiceLookupForm = ({ loading, onSearch, onLoadJson }) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(invoiceNumber);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <label htmlFor="invoice-number" className="text-xs font-semibold text-neutral-700">
          Número de factura
        </label>
        <input
          id="invoice-number"
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Ej. SERIE H 0000255"
          className="input-field input-field-sm w-64 font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          Buscar
        </button>
        <button
          type="button"
          onClick={() => setShowJsonInput((open) => !open)}
          className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
          {showJsonInput ? 'Ocultar JSON' : 'Pegar JSON'}
        </button>

        <span
          className={`ml-auto badge ${INVOICE_API_MODE === 'mock' ? 'badge-warning' : 'badge-success'}`}
          title="Se configura con VITE_BACKEND_URL o VITE_INVOICE_API_URL en .env.local"
        >
          {API_MODE_LABELS[INVOICE_API_MODE]}
        </span>
      </form>

      {INVOICE_API_MODE === 'mock' && (
        <p className="text-[11px] text-muted">
          Modo simulado: prueba con{' '}
          {MOCK_INVOICE_NUMBERS.map((number, index) => (
            <span key={number}>
              {index > 0 && ' o '}
              <button type="button" className="font-mono text-primary-600 underline" onClick={() => onSearch(number)}>
                {number}
              </button>
            </span>
          ))}
          .
        </p>
      )}

      {/* Prueba de traducción con un JSON pegado (p. ej. el ejemplo que envíe la empresa). */}
      {showJsonInput && (
        <div className="space-y-2">
          <textarea
            rows={8}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Pega aquí el JSON que devuelve la API, p. ej. { "facturaNo": "...", ... }'
            className="input-field w-full font-mono text-[11px]"
          />
          <button
            type="button"
            disabled={loading || !jsonText.trim()}
            onClick={() => onLoadJson(jsonText)}
            className="btn-primary px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
          >
            Cargar JSON
          </button>
        </div>
      )}
    </div>
  );
};
