/**
 * @file Estructura común de las barras laterales del editor.
 *
 * Antes cada barra (Toolbox, Propiedades, Configuración de página) repetía
 * el mismo `<aside>` con su encabezado; ahora comparten este componente.
 *
 * La altura la da el contenedor flex del editor (ya no `100vh`), para que
 * funcione igual dentro del <Outlet/> de la plantilla de la empresa, que
 * tendrá su propia cabecera.
 */

/**
 * @param {Object} props
 * @param {'left'|'right'} [props.side='right']  Lado del lienzo (define el borde).
 * @param {string}  props.title                  Título en mayúsculas del encabezado.
 * @param {import('react').ReactNode} [props.subtitle]
 * @param {import('react').ComponentType<{className?:string}>} [props.icon] Icono de lucide-react.
 * @param {import('react').ReactNode} [props.headerAction] Botón opcional a la derecha del título.
 * @param {import('react').ReactNode} [props.headerExtra]  Contenido extra bajo el título (p. ej. pestañas).
 * @param {string}  [props.bodyClassName]        Clases del cuerpo desplazable.
 * @param {import('react').ReactNode} props.children
 */
export const SidebarPanel = ({
  side = 'right',
  title,
  subtitle,
  icon: Icon,
  headerAction,
  headerExtra,
  bodyClassName = 'p-4 space-y-4 text-xs',
  children,
}) => {
  const borderClass = side === 'left' ? 'border-r' : 'border-l';

  return (
    <aside
      className={`no-print w-72 bg-white ${borderClass} border-neutral-200 text-neutral-800 flex flex-col min-h-0 shrink-0 select-none shadow-sm`}
    >
      {/* Encabezado */}
      <div className="p-4 border-b border-neutral-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5 text-primary-600" />}
              {title}
            </h2>
            {subtitle && <p className="text-[11px] text-subtle mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
        {headerExtra}
      </div>

      {/* Cuerpo con scroll independiente */}
      <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>{children}</div>
    </aside>
  );
};
