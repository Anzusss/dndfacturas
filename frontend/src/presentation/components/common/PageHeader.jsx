/**
 * @file Encabezado estándar de las páginas de listado (Imprimir, Plantillas, Auditoría).
 */

/**
 * @param {Object} props
 * @param {import('react').ComponentType<{className?:string}>} props.icon Icono del título.
 * @param {string} props.title
 * @param {string} props.description
 * @param {import('react').ReactNode} [props.actions] Contenido a la derecha (botones, contadores).
 */
export const PageHeader = ({ icon: Icon, title, description, actions }) => (
  <div className="space-y-4 border-b border-neutral-200 pb-4">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-heading flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-600" />
          {title}
        </h1>
        <p className="text-xs text-muted mt-1">{description}</p>
      </div>
      {actions}
    </div>
  </div>
);
