/**
 * @file Store global del editor (Zustand).
 *
 * Capa: ESTADO / APLICACIÓN. Contiene la plantilla que se está editando y el
 * estado de la interfaz del lienzo (selección, zoom, vista previa, guías).
 * Las reglas de creación de bloques viven en el dominio (`elementFactory`);
 * aquí solo se orquestan las actualizaciones inmutables del estado.
 *
 * BLOQUEO: solo los borradores se pueden modificar. Todas las acciones que
 * cambian la plantilla pasan por `whenEditable`, que ignora el cambio si la
 * plantilla está en revisión o aprobada (defensa extra, además de la UI).
 *
 * IMPORTANTE (rendimiento): consume el store siempre con un selector,
 * p. ej. `useEditorStore((s) => s.zoom)`. Llamar a `useEditorStore()` sin
 * selector suscribe el componente a TODO el estado y lo re-renderiza en cada
 * movimiento del ratón mientras se arrastra un bloque.
 */

import { create } from 'zustand';
import {
  createDefaultInvoiceTemplate,
  createDefaultLayout,
  normalizeTemplate,
} from '@/domain/models/invoiceTemplate';
import { isEditable } from '@/domain/models/templateLifecycle';
import { createElement, duplicateElementData, getElementRect } from '@/domain/models/elementFactory';
import { buildPaperSetup, fitRectToSheet, getPaperDimensions } from '@/domain/constants/paperSizes';
import { ZOOM_LIMITS } from '@/domain/constants/editorConfig';

/** Estado de guías "sin guía activa". */
const NO_GUIDES = { x: null, y: null };

/**
 * Devuelve una copia de la plantilla con la lista de elementos transformada.
 * @param {Object} template
 * @param {(elements: Object[]) => Object[]} transform
 */
const withElements = (template, transform) => ({
  ...template,
  elements: transform(template.elements),
});

/**
 * Envuelve un "updater" de Zustand para que solo se aplique sobre borradores.
 * @param {(state: Object) => Object} updater
 * @returns {(state: Object) => Object}
 */
const whenEditable = (updater) => (state) => (isEditable(state.template) ? updater(state) : state);

/** Medidas de la hoja de la plantilla abierta. */
const sheetOf = (state) => getPaperDimensions(state.template.pageSetup);

export const useEditorStore = create((set) => ({
  // ───────────── Estado ─────────────

  /** Plantilla (versión concreta) abierta en el editor. */
  template: createDefaultInvoiceTemplate(),

  /** Id del bloque seleccionado o `null` si no hay selección. */
  selectedElementId: null,

  /** Escala del lienzo (1 = 100%). */
  zoom: ZOOM_LIMITS.DEFAULT,

  /** Vista previa: congela arrastre/redimensión y oculta ayudas visuales. */
  previewMode: false,

  /** Muestra las zonas reservadas de margen (membrete / pie). */
  showGridLines: true,

  /** Guías inteligentes de alineación activas durante el arrastre (en px). */
  guideLines: NO_GUIDES,

  // ───────────── Acciones de interfaz ─────────────

  /** Abre una plantilla en el editor (p. ej. desde la página de plantillas). */
  setTemplate: (template) =>
    set({
      template: normalizeTemplate(template),
      selectedElementId: null,
      previewMode: false,
      guideLines: NO_GUIDES,
    }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  /** Ajusta el zoom respetando los límites y redondeando a 2 decimales
   *  (evita valores como 0.30000000000000004 al sumar pasos de 0.1). */
  setZoom: (zoom) =>
    set({
      zoom: Math.round(Math.min(ZOOM_LIMITS.MAX, Math.max(ZOOM_LIMITS.MIN, zoom)) * 100) / 100,
    }),

  setPreviewMode: (previewMode) => set({ previewMode }),

  toggleGridLines: () => set((state) => ({ showGridLines: !state.showGridLines })),

  /** Actualiza las guías de alineación en tiempo real. */
  setGuideLines: (guideLines) => set({ guideLines }),

  /** Oculta las guías de alineación. */
  clearGuideLines: () => set({ guideLines: NO_GUIDES }),

  // ───────────── Acciones sobre la plantilla (solo borradores) ─────────────

  /** Cambia el nombre visible de la plantilla. */
  renameTemplate: (name) => set(whenEditable((state) => ({ template: { ...state.template, name } }))),

  /** Cambia el tipo de factura (crédito/contado) para el que se diseña. */
  setInvoiceType: (invoiceType) =>
    set(whenEditable((state) => ({ template: { ...state.template, invoiceType } }))),

  /** Mezcla cambios en la configuración de página (márgenes, fuente…). */
  updatePageSetup: (pageSetupUpdates) =>
    set(
      whenEditable((state) => ({
        template: {
          ...state.template,
          pageSetup: { ...state.template.pageSetup, ...pageSetupUpdates },
        },
      })),
    ),

  /**
   * Cambia el tamaño u orientación de la hoja.
   * @param {{size:string, orientation?:string, customWidthMm?:number, customHeightMm?:number}} paper
   */
  setPaperSize: (paper) =>
    set(
      whenEditable((state) => ({
        template: {
          ...state.template,
          pageSetup: { ...state.template.pageSetup, ...buildPaperSetup(paper) },
        },
      })),
    ),

  /** Recoloca (y encoge si hace falta) los bloques que se salen de la hoja. */
  fitElementsToSheet: () =>
    set(
      whenEditable((state) => {
        const sheet = sheetOf(state);
        return {
          template: withElements(state.template, (elements) =>
            elements.map((el) => ({ ...el, ...fitRectToSheet(getElementRect(el), sheet) })),
          ),
        };
      }),
    ),

  /**
   * Restaura el diseño base del tamaño de hoja actual (ver createDefaultLayout),
   * conservando la identidad de la plantilla (id, versión, nombre, tipo,
   * estado). Así "Restaurar" + "Guardar" nunca sobrescribe otra plantilla.
   */
  resetToDefault: () =>
    set(
      whenEditable((state) => ({
        template: { ...state.template, ...createDefaultLayout(state.template.pageSetup) },
        selectedElementId: null,
        guideLines: NO_GUIDES,
      })),
    ),

  // ───────────── Acciones sobre bloques (solo borradores) ─────────────

  /**
   * Añade un bloque a partir de datos parciales y lo deja seleccionado.
   * `createElement` completa id, posición y tamaño si faltan.
   */
  addElement: (data) =>
    set(
      whenEditable((state) => {
        const element = createElement(data, state.template.elements, sheetOf(state));
        return {
          template: withElements(state.template, (elements) => [...elements, element]),
          selectedElementId: element.id,
        };
      }),
    ),

  /** Mezcla cambios en un bloque concreto. */
  updateElement: (id, updates) =>
    set(
      whenEditable((state) => ({
        template: withElements(state.template, (elements) =>
          elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
        ),
      })),
    ),

  /** Elimina un bloque y limpia la selección si era el seleccionado. */
  removeElement: (id) =>
    set(
      whenEditable((state) => ({
        template: withElements(state.template, (elements) => elements.filter((el) => el.id !== id)),
        selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
      })),
    ),

  /**
   * Mueve un bloque una posición en el orden de apilamiento (z-order).
   * @param {string} id
   * @param {'up'|'down'} direction
   */
  moveElement: (id, direction) =>
    set(
      whenEditable((state) => {
        const elements = [...state.template.elements];
        const index = elements.findIndex((el) => el.id === id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (index === -1 || targetIndex < 0 || targetIndex >= elements.length) return state;

        const [moved] = elements.splice(index, 1);
        elements.splice(targetIndex, 0, moved);
        return { template: { ...state.template, elements } };
      }),
    ),

  /** Duplica un bloque justo después del original y selecciona la copia. */
  duplicateElement: (id) =>
    set(
      whenEditable((state) => {
        const index = state.template.elements.findIndex((el) => el.id === id);
        if (index === -1) return state;

        const copy = duplicateElementData(state.template.elements[index], sheetOf(state));
        const elements = [...state.template.elements];
        elements.splice(index + 1, 0, copy);

        return { template: { ...state.template, elements }, selectedElementId: copy.id };
      }),
    ),
}));
