/**
 * @file Guías inteligentes (líneas rojas discontinuas) que aparecen mientras
 * se arrastra o redimensiona un bloque y este se alinea con otro.
 *
 * Es el único componente suscrito a `guideLines`, de modo que los cambios
 * continuos durante el arrastre solo re-renderizan estas dos líneas.
 */

import { useEditorStore } from '@/store/useEditorStore';

/** Etiqueta con la coordenada de la guía. */
const GuideLabel = ({ value, className }) => (
  <span className={`absolute bg-red-500 text-white text-[9px] px-1 rounded font-mono ${className}`}>
    {Math.round(value)}px
  </span>
);

export const CanvasGuides = () => {
  const guideLines = useEditorStore((s) => s.guideLines);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 no-print">
      {/* Guía vertical (alineación en el eje X) */}
      {guideLines.x !== null && (
        <div
          className="absolute top-0 bottom-0 border-l border-dashed border-red-500"
          style={{ left: `${guideLines.x}px` }}
        >
          <GuideLabel value={guideLines.x} className="top-2 left-1" />
        </div>
      )}

      {/* Guía horizontal (alineación en el eje Y) */}
      {guideLines.y !== null && (
        <div
          className="absolute left-0 right-0 border-t border-dashed border-red-500"
          style={{ top: `${guideLines.y}px` }}
        >
          <GuideLabel value={guideLines.y} className="left-2 top-1" />
        </div>
      )}
    </div>
  );
};
