import React from "react";

interface ResultItemProps {
  result: any;
  idx: number;
  selectedIndex: number;
  handleItemSelect: (idx: number) => void;
  setSelectedIndex: (idx: number) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({
  result,
  idx,
  selectedIndex,
  handleItemSelect,
  setSelectedIndex,
}) => {
  return (
    <React.Fragment key={result.to}>
      {idx === 2 && (
        <div className="px-3 py-2 mt-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-t border-border-subtle dark:border-slate-700/50 pt-4">
          Módulos Sugeridos
        </div>
      )}
      <div
        onClick={() => handleItemSelect(idx)}
        onMouseEnter={() => setSelectedIndex(idx)}
        className={`flex items-center gap-3 p-3 rounded-xl transition-colors group cursor-pointer ${
          selectedIndex === idx
            ? "bg-surface-container-high dark:bg-slate-700/80 ring-1 ring-primary/30"
            : "hover:bg-surface-container-low dark:hover:bg-slate-800/50"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.colorClass}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {result.icon}
          </span>
        </div>
        <div>
          <div
            className={`text-sm font-bold transition-colors ${
              selectedIndex === idx
                ? result.activeTextClass
                : `text-on-surface dark:text-slate-200 ${result.hoverTextClass}`
            }`}
          >
            {result.title}
          </div>
          <div className="text-xs text-on-surface-variant dark:text-slate-400">
            {result.desc}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResultItem;
