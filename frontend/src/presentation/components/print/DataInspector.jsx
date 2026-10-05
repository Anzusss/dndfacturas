/**
 * @file Panel de depuración: muestra el JSON recibido de la API y cómo quedó
 * tras la traducción. Sirve para ajustar `DYNAMICS_FIELD_MAP` cuando llegue
 * la API real (si un campo sale vacío, aquí se ve dónde venía en el JSON).
 */

/**
 * @param {Object} props
 * @param {Object} props.raw     JSON original de la API.
 * @param {Object} props.invoice Datos traducidos (InvoiceData).
 */
export const DataInspector = ({ raw, invoice }) => (
  <details className="bg-white rounded-xl border border-neutral-200 shadow-sm text-xs">
    <summary className="px-4 py-2.5 cursor-pointer font-semibold text-neutral-700 select-none">
      Datos técnicos (JSON recibido y traducido)
    </summary>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4 pt-1">
      {[
        { title: 'JSON recibido de la API', value: raw },
        { title: 'Datos traducidos (InvoiceData)', value: invoice },
      ].map(({ title, value }) => (
        <div key={title} className="min-w-0">
          <h4 className="text-[11px] font-semibold text-muted mb-1">{title}</h4>
          <pre className="font-mono text-[10px] bg-neutral-50 p-3 rounded-lg border border-neutral-200 overflow-auto max-h-80">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  </details>
);
