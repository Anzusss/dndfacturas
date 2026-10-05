/**
 * @file Selectores reutilizables del store del editor.
 *
 * Capa: ESTADO. Centralizar los selectores evita repetir la misma búsqueda
 * en varios componentes y garantiza suscripciones mínimas.
 */

import { isEditable } from '@/domain/models/templateLifecycle';

/**
 * Devuelve el bloque seleccionado o `null`.
 * Como devuelve la misma referencia mientras el bloque no cambie, Zustand
 * no re-renderiza a los consumidores sin necesidad.
 */
export const selectSelectedElement = (state) =>
  state.template.elements.find((el) => el.id === state.selectedElementId) ?? null;

/**
 * Crea un selector booleano "¿este bloque está seleccionado?". Cada bloque
 * solo se re-renderiza cuando SU estado de selección cambia.
 * @param {string} id
 */
export const selectIsSelected = (id) => (state) => state.selectedElementId === id;

/** `true` si la plantilla abierta es un borrador (se puede editar). */
export const selectIsEditable = (state) => isEditable(state.template);
