/**
 * @file Comportamiento común de los elementos del Toolbox: se pueden
 * arrastrar a la hoja o insertar con un clic.
 * Antes esta lógica estaba duplicada en ToolboxItem y ToolboxVariableItem.
 */

import { writeDragPayload } from '../dragAndDrop';

/**
 * @param {Object}   payload  Datos parciales del bloque a crear.
 * @param {Function} onInsert Callback de inserción por clic.
 * @returns {Object} Props para esparcir sobre el elemento raíz del ítem.
 */
export const getToolboxItemProps = (payload, onInsert) => ({
  draggable: true,
  onDragStart: (event) => writeDragPayload(event, payload),
  onClick: () => onInsert(payload),
  title: 'Arrastra a la hoja o haz clic',
});
