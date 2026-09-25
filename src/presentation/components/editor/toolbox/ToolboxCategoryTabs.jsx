import React from 'react';

export const ToolboxCategoryTabs = ({ categories, activeTab, onSelectTab }) => {
    return (
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 overflow-x-auto text-[11px]">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelectTab(cat.id)}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap font-medium ${activeTab === cat.id
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};