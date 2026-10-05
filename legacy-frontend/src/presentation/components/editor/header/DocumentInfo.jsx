/**
 * @file Bloque izquierdo de la cabecera: nombre de la plantilla, tamaño de
 * hoja y márgenes físicos actuales.
 */

import { FileText } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { describePaper } from '@/domain/constants/paperSizes';

export const DocumentInfo = () => {
  const name = useEditorStore((s) => s.template.name);
  const pageSetup = useEditorStore((s) => s.template.pageSetup);

  return (
    <div className="flex items-center space-x-3 min-w-0">
      <div className="bg-primary-50 border border-primary-100 p-1.5 rounded-lg flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-primary-600" />
      </div>
      <div className="min-w-0">
        <h1 className="text-sm font-bold tracking-tight text-heading flex items-center gap-2">
          <span className="truncate">{name}</span>
          <span className="badge badge-primary text-xs font-mono font-medium shrink-0">
            {describePaper(pageSetup)}
          </span>
        </h1>
        <p className="text-[11px] text-muted truncate">
          Márgenes físicos: Membrete {pageSetup.paddingTop} | Colecta {pageSetup.paddingBottom}
        </p>
      </div>
    </div>
  );
};
