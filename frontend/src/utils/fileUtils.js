/**
 * @file Descarga y lectura de archivos en el navegador.
 *
 * Capa: UTILIDADES (DOM).
 */

/** Tamaño máximo aceptado para un archivo importado (una plantilla pesa pocos KB). */
export const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;

/**
 * Descarga un objeto como archivo .json.
 * @param {string} fileName
 * @param {Object} data
 */
export const downloadJson = (fileName, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  // Libera la memoria del Blob cuando el navegador ya inició la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/**
 * Lee un archivo elegido por el usuario como texto.
 * @param {File} file
 * @returns {Promise<string>}
 * @throws {Error} Si el archivo supera MAX_IMPORT_FILE_BYTES.
 */
export const readFileAsText = async (file) => {
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new Error('El archivo es demasiado grande para ser una plantilla (máx. 2 MB).');
  }
  return file.text();
};
