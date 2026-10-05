/**
 * @file Tarjeta de un elemento estructural del Toolbox (Grid, Tabla, Totales…).
 */

import { GripVertical, PlusCircle } from 'lucide-react';
import { getToolboxItemProps } from './toolboxItemProps';

/**
 * @param {Object}   props
 * @param {string}   props.title
 * @param {string}   props.subtitle
 * @param {import('react').ComponentType<{className?:string}>} props.icon
 * @param {string}   props.iconColor Clases de color del icono.
 * @param {Object}   props.data      Datos del bloque a crear.
 * @param {Function} props.onInsert  Inserción por clic.
 */
export const ToolboxItem = ({ title, subtitle, icon: Icon, iconColor, data, onInsert }) => {
  const itemProps = getToolboxItemProps(data, onInsert);

  return (
    <div
      {...itemProps}
      className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-primary-300 cursor-grab active:cursor-grabbing transition group select-none"
    >
      <div className="flex items-center space-x-2.5 truncate">
        <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
        <div className={`p-1.5 rounded-md ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="text-xs font-medium text-neutral-800 truncate">{title}</div>
          <div className="text-[10px] text-muted truncate">{subtitle}</div>
        </div>
      </div>
      <PlusCircle className="w-4 h-4 text-neutral-400 group-hover:text-primary-500 shrink-0 ml-1" />
    </div>
  );
};
