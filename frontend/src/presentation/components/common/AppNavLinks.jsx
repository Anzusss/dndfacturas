/**
 * @file Enlaces de navegación entre las secciones de la app.
 *
 * Antes las páginas de Plantillas y Auditoría existían pero no había ningún
 * enlace hacia ellas (solo se podía llegar escribiendo la URL).
 */

import { NavLink } from 'react-router-dom';
import { FileText, History, Layers, Printer } from 'lucide-react';
import { ROUTES } from '@/routes/routePaths';

/** Secciones navegables. `end` evita que "/" quede activo en todas las rutas. */
const NAV_ITEMS = [
  { to: ROUTES.EDITOR, label: 'Editor', icon: FileText, end: true },
  { to: ROUTES.PRINT, label: 'Imprimir', icon: Printer },
  { to: ROUTES.TEMPLATES, label: 'Plantillas', icon: Layers },
  { to: ROUTES.AUDIT, label: 'Auditoría', icon: History },
];

/**
 * @param {Object}  props
 * @param {boolean} [props.compact=false] Solo iconos (para la cabecera del editor).
 */
export const AppNavLinks = ({ compact = false }) => (
  <nav className="flex items-center gap-1" aria-label="Secciones">
    {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        title={label}
        className={({ isActive }) =>
          `flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition ${
            isActive
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`
        }
      >
        <Icon className="w-3.5 h-3.5" />
        {!compact && <span>{label}</span>}
      </NavLink>
    ))}
  </nav>
);
