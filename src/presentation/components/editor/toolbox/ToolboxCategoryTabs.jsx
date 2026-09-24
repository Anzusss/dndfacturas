import React from 'react';

export const ToolboxCategoryTabs = ({ categories, activeTab, onSelectTab }) => {
    return (
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto text-[11px]">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectTab(cat.id)}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap font-medium ${activeTab === cat.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};