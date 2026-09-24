import { create } from 'zustand';
import { createDefaultInvoiceTemplate } from '../domain/models/invoiceTemplate';

export const useEditorStore = create((set, get) => ({
  template: createDefaultInvoiceTemplate(),
  selectedElementId: null,
  zoom: 1, // 100%
  previewMode: false,
  showGridLines: true,

  // === ESTADO PARA LAS GUÍAS INTELIGENTES ===
  guideLines: { x: null, y: null },

  setTemplate: (template) => set({ template }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  setZoom: (zoom) => set({ zoom }),

  setPreviewMode: (previewMode) => set({ previewMode }),

  toggleGridLines: () => set((state) => ({ showGridLines: !state.showGridLines })),

  // === ACCIÓN PARA ACTUALIZAR LAS LÍNEAS DE GUÍA EN TIEMPO REAL ===
  setGuideLines: (guideLines) => set({ guideLines }),

  addElement: (newElement) => {
    set((state) => {
      const defaultY = state.template.elements.length > 0
        ? Math.min(850, Math.max(...state.template.elements.map((e) => (typeof e.y === 'number' ? e.y : 200))) + 30)
        : 200;

      const elementWithCoords = {
        x: typeof newElement.x === 'number' ? newElement.x : 57,
        y: typeof newElement.y === 'number' ? newElement.y : defaultY,
        width: typeof newElement.width === 'number' ? newElement.width : 350,
        height: typeof newElement.height === 'number' ? newElement.height : 110,
        ...newElement,
      };

      return {
        template: {
          ...state.template,
          elements: [...state.template.elements, elementWithCoords],
        },
        selectedElementId: elementWithCoords.id,
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => ({
      template: {
        ...state.template,
        elements: state.template.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      },
    }));
  },

  removeElement: (id) => {
    set((state) => ({
      template: {
        ...state.template,
        elements: state.template.elements.filter((el) => el.id !== id),
      },
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
  },

  moveElement: (id, direction) => {
    set((state) => {
      const elements = [...state.template.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return state;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= elements.length) return state;

      const [removed] = elements.splice(index, 1);
      elements.splice(targetIndex, 0, removed);

      return {
        template: {
          ...state.template,
          elements,
        },
      };
    });
  },

  duplicateElement: (id) => {
    set((state) => {
      const element = state.template.elements.find((el) => el.id === id);
      if (!element) return state;

      const duplicated = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        title: `${element.title || 'Bloque'} (Copia)`,
        x: Math.min(700, (typeof element.x === 'number' ? element.x : 57) + 20),
        y: Math.min(950, (typeof element.y === 'number' ? element.y : 200) + 20),
      };

      const index = state.template.elements.findIndex((el) => el.id === id);
      const elements = [...state.template.elements];
      elements.splice(index + 1, 0, duplicated);

      return {
        template: {
          ...state.template,
          elements,
        },
        selectedElementId: duplicated.id,
      };
    });
  },

  updatePageSetup: (pageSetupUpdates) => {
    set((state) => ({
      template: {
        ...state.template,
        pageSetup: {
          ...state.template.pageSetup,
          ...pageSetupUpdates,
        },
      },
    }));
  },

  resetToDefault: () => {
    const defaultTemplate = createDefaultInvoiceTemplate();
    set({
      template: defaultTemplate,
      selectedElementId: null,
      guideLines: { x: null, y: null },
    });
  },

  getSelectedElement: () => {
    const { template, selectedElementId } = get();
    return template.elements.find((el) => el.id === selectedElementId) || null;
  },
}));