import React from "react";
import { useSearchModal } from "../../hooks/useSearchModal";
import ResultItem from "./ResultItem";

interface HeaderSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderSearchModal: React.FC<HeaderSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    searchResults,
    selectedIndex,
    setSelectedIndex,
    handleSearchKeyDown,
    handleItemSelect,
  } = useSearchModal(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[120] flex items-start justify-center pt-20 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-2xl shadow-2xl border border-border-subtle max-w-xl w-full overflow-hidden animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-surface-container-low dark:bg-slate-800/80">
          <span className="material-symbols-outlined text-primary dark:text-inverse-primary text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Escribe para buscar páginas o módulos..."
            className="w-full bg-transparent text-sm text-on-surface dark:text-slate-200 focus:outline-none placeholder:text-on-surface-variant/70 dark:placeholder:text-slate-500 font-medium"
            autoFocus
            onKeyDown={handleSearchKeyDown}
          />
          <kbd
            onClick={onClose}
            className="text-[11px] font-bold bg-surface-container dark:bg-slate-700/80 px-2 py-1 rounded text-primary dark:text-inverse-primary border border-border-subtle dark:border-slate-600 uppercase cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            ESC
          </kbd>
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Búsquedas Recientes
          </div>

          {searchResults.map((result, idx) => (
            <ResultItem
              key={idx}
              result={result}
              idx={idx}
              selectedIndex={selectedIndex}
              handleItemSelect={handleItemSelect}
              setSelectedIndex={setSelectedIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
