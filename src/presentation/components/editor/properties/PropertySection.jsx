/**
 * @file Tarjeta gris con título que agrupa controles dentro de los paneles
 * de propiedades. Sustituye el contenedor
 * `p-3 bg-neutral-50 rounded-lg border border-neutral-200` repetido en cada panel.
 */

/**
 * @param {Object} props
 * @param {string} [props.title]
 * @param {import('react').ComponentType<{className?:string}>} [props.icon] Icono junto al título (lo resalta en azul).
 * @param {import('react').ReactNode} [props.action] Control a la derecha del título (p. ej. "Agregar").
 * @param {import('react').ReactNode} props.children
 */
export const PropertySection = ({ title, icon: Icon, action, children }) => (
  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
    {title && (
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] font-semibold flex items-center gap-1 ${
            Icon ? 'text-primary-600' : 'text-neutral-700'
          }`}
        >
          {Icon && <Icon className="w-3 h-3 text-primary-500" />}
          {title}
        </span>
        {action}
      </div>
    )}
    {children}
  </div>
);
