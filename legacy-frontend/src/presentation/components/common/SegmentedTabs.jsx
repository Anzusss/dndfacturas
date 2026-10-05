/**
 * @file Pestañas tipo "segmented control" (fondo gris, pestaña activa en azul).
 * Las usan el Toolbox (categorías) y la Auditoría (impresiones / historial).
 */

/**
 * @param {Object}   props
 * @param {Array<{id:string, label:string}>} props.tabs
 * @param {string}   props.activeTab  Id de la pestaña activa.
 * @param {(id:string) => void} props.onSelect
 * @param {string}  [props.className] Clases extra del contenedor.
 */
export const SegmentedTabs = ({ tabs, activeTab, onSelect, className = '' }) => (
  <div
    role="tablist"
    className={`flex gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 overflow-x-auto text-[11px] ${className}`}
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(tab.id)}
          className={`px-2.5 py-1 rounded-md transition whitespace-nowrap font-medium ${
            isActive
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);
