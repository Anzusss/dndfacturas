/**
 * @file Selector de rol SIMULADO para probar el flujo de aprobación
 * (Diseñador / Gerente) mientras no exista el inicio de sesión real.
 * ELIMINAR cuando la plantilla de la empresa aporte el usuario.
 */

import { UserCog } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';
import { ROLES, ROLE_LABELS } from '@/domain/models/permissions';

export const RoleSwitcher = () => {
  const role = useSessionStore((s) => s.role);
  const setRole = useSessionStore((s) => s.setRole);

  return (
    <label
      className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1"
      title="Rol simulado hasta integrar el inicio de sesión de la empresa"
    >
      <UserCog className="w-3.5 h-3.5" />
      <span className="hidden xl:inline">Rol (simulado):</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
      >
        {Object.values(ROLES).map((value) => (
          <option key={value} value={value}>
            {ROLE_LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
};
