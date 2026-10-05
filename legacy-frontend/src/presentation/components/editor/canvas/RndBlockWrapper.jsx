/**
 * @file Envoltorio arrastrable/redimensionable (react-rnd) de cada bloque.
 *
 * Responsabilidades:
 * - Posicionar el bloque y gestionar la selección.
 * - Bloquear arrastre y selección si la plantilla no es un borrador.
 * - Delegar el gesto de arrastre/redimensión en `useBlockInteractions`.
 * - Pintar la barra flotante, los tiradores y el contenido del bloque.
 *
 * Está envuelto en `memo` y usa selectores finos del store: cuando se mueve
 * un bloque, los demás no se vuelven a renderizar.
 */

import { memo } from 'react';
import { Rnd } from 'react-rnd';
import { TRANSPARENT_ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { useEditorStore } from '@/store/useEditorStore';
import { selectIsEditable, selectIsSelected } from '@/store/editorSelectors';
import { BlockRenderer } from '@/presentation/components/invoice/blocks/BlockRenderer';
import { FloatingControls } from './blocks/FloatingControls';
import { SelectionHandles } from './blocks/SelectionHandles';
import { useBlockInteractions } from './hooks/useBlockInteractions';

/**
 * Clases del contenedor según el estado del bloque.
 * @param {{previewMode:boolean, isSelected:boolean, isTransparent:boolean}} state
 * @returns {string}
 */
const getBlockClassName = ({ previewMode, isSelected, isTransparent }) => {
  if (previewMode) return 'z-10 border border-transparent';

  if (isSelected) {
    return `z-50 ring-2 ring-primary-500 border border-primary-400 shadow-md ${
      isTransparent ? 'bg-transparent' : 'bg-white'
    }`;
  }
  return `z-10 border border-dashed border-neutral-300 hover:border-neutral-400 ${
    isTransparent ? 'bg-transparent' : 'bg-white/90'
  }`;
};

/**
 * @param {Object} props
 * @param {Object} props.element Bloque de la plantilla.
 * @param {Object} props.data    Datos con los que se dibuja (en el editor, la factura de ejemplo).
 */
export const RndBlockWrapper = memo(function RndBlockWrapper({ element, data }) {
  const isSelectedInStore = useEditorStore(selectIsSelected(element.id));
  const zoom = useEditorStore((s) => s.zoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const setSelectedElementId = useEditorStore((s) => s.setSelectedElementId);
  const editable = useEditorStore(selectIsEditable);

  // Se puede mover/seleccionar solo si es un borrador y no se está en vista previa.
  const interactive = editable && !previewMode;
  const isSelected = isSelectedInStore && interactive;
  const isTransparent = TRANSPARENT_ELEMENT_TYPES.includes(element.type);

  const { rect, handlers } = useBlockInteractions(element);

  /** Selecciona el bloque sin que el clic llegue al lienzo (que deseleccionaría). */
  const selectElement = (event) => {
    event.stopPropagation();
    if (interactive) setSelectedElementId(element.id);
  };

  return (
    <Rnd
      size={{ width: rect.width, height: rect.height }}
      position={{ x: rect.x, y: rect.y }}
      onDragStart={selectElement}
      onResizeStart={selectElement}
      {...handlers}
      bounds="parent"
      scale={zoom} // Corrige el desplazamiento del ratón cuando la hoja está escalada.
      disableDragging={!interactive}
      enableResizing={interactive}
      className={`group transition-shadow ${getBlockClassName({ previewMode, isSelected, isTransparent })}`}
      style={{ boxSizing: 'border-box' }}
    >
      <div
        className={`w-full h-full relative ${interactive ? 'cursor-move' : 'cursor-default'}`}
        onClick={selectElement}
      >
        {isSelected && <FloatingControls elementId={element.id} rect={rect} />}

        <BlockRenderer element={element} data={data} previewMode={previewMode} />

        {isSelected && <SelectionHandles />}
      </div>
    </Rnd>
  );
});
