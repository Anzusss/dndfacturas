/**
 * @file Pestañas para filtrar los elementos del Toolbox por categoría.
 */

import { SegmentedTabs } from '@/presentation/components/common/SegmentedTabs';

/**
 * @param {Object}   props
 * @param {Array<{id:string, label:string}>} props.categories
 * @param {string}   props.activeTab   Id de la pestaña activa.
 * @param {(id:string) => void} props.onSelectTab
 */
export const ToolboxCategoryTabs = ({ categories, activeTab, onSelectTab }) => (
  <SegmentedTabs tabs={categories} activeTab={activeTab} onSelect={onSelectTab} />
);
