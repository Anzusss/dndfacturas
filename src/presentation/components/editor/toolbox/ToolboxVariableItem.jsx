import React from 'react';
import { GripVertical, PlusCircle } from 'lucide-react';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';

export const ToolboxVariableItem = ({ variable, onInsert }) => {
  const payload = {
    type: ELEMENT_TYPES.VARIABLE,
    title: variable.label,
    variableKey: variable.key,
    sampleValue: variable.sample,
    width: 220,
    height: 40,
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onInsert(payload)}
      className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 cursor-grab active:cursor-grabbing text-left transition group text-xs select-none"
      title="Arrastra a la hoja o haz clic"
    >
      <div className="truncate flex items-center gap-1.5">
        <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
        <div className="truncate">
          <div className="font-mono text-[11px] text-purple-300">
            {`{{${variable.key}}}`}
          </div>
          <div className="text-[10px] text-slate-400 truncate">{variable.label}</div>
        </div>
      </div>
      <PlusCircle className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 shrink-0 ml-1" />
    </div>
  );
};