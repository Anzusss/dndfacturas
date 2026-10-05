/**
 * @file Botón "Importar" que abre el selector de archivos (.json).
 */

import { useRef } from 'react';
import { Upload } from 'lucide-react';

/**
 * @param {Object} props
 * @param {(file: File) => void} props.onImport Recibe el archivo elegido.
 */
export const ImportTemplateButton = ({ onImport }) => {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const [file] = event.target.files;
    if (file) onImport(file);
    event.target.value = ''; // Permite volver a elegir el mismo archivo.
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="btn-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
      >
        <Upload className="w-4 h-4" />
        <span>Importar</span>
      </button>
      <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleChange} />
    </>
  );
};
