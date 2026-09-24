import React from 'react';
import { GripVertical, PlusCircle } from 'lucide-react';

export const ToolboxItem = ({ title, subtitle, icon: Icon, iconColor, data, onInsert }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onInsert(data)}
      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing transition group select-none"
      title="Arrastra a la hoja o haz clic"
    >
      <div className="flex items-center space-x-2.5 truncate">
        <GripVertical className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0" />
        <div className={`p-1.5 rounded-md ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="text-xs font-medium text-slate-200 truncate">{title}</div>
          <div className="text-[10px] text-slate-400 truncate">{subtitle}</div>
        </div>
      </div>
      <PlusCircle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-1" />
    </div>
  );
};