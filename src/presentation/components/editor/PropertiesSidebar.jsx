/**
 * @file Barra lateral derecha del editor.
 * - Sin bloque seleccionado → configuración de la página.
 * - Con bloque seleccionado → propiedades de ese bloque.
 */

import { useEditorStore } from '@/store/useEditorStore';
import { selectSelectedElement } from '@/store/editorSelectors';
import { PageSetupPanel } from './properties/PageSetupPanel';
import { BlockPropertiesPanel } from './properties/BlockPropertiesPanel';

export const PropertiesSidebar = () => {
  const selectedElement = useEditorStore(selectSelectedElement);

  return selectedElement ? <BlockPropertiesPanel element={selectedElement} /> : <PageSetupPanel />;
};
