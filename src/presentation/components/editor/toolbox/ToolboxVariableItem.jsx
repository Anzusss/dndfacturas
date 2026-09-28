/**
 * @file Elemento del Toolbox para insertar una variable suelta del ERP
 * (se muestra como `{{clave}}`).
 */

import { GripVertical, PlusCircle } from 'lucide-react';
import { createVariablePayload } from './config/toolboxCatalog';
import { getToolboxItemProps } from './toolboxItemProps';

/**
 * @param {Object}   props
 * @param {import('@/domain/constants/dynamicsVariables').InvoiceField} props.variable
 * @param {Function} props.onInsert Inserción por clic.
 */
export const ToolboxVariableItem = ({ variable, onInsert }) => {
  const itemProps = getToolboxItemProps(createVariablePayload(variable), onInsert);

  return (
    <div
      {...itemProps}
      className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 cursor-grab active:cursor-grabbing text-left transition group text-xs select-none"
    >
      <div className="truncate flex items-center gap-1.5">
        <GripVertical className="w-3 h-3 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
        <div className="truncate">
          <div className="font-mono text-[11px] text-primary-600">{`{{${variable.key}}}`}</div>
          <div className="text-[10px] text-muted truncate">{variable.label}</div>
        </div>
      </div>
      <PlusCircle className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-500 shrink-0 ml-1" />
    </div>
  );
};
