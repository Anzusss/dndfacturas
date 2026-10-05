/**
 * @file Impresión aislada de la hoja de factura.
 *
 * Capa: UTILIDADES (DOM). Clona la hoja `#invoice-print-sheet` dentro de un
 * iframe oculto junto con las hojas de estilo de la app y lanza el diálogo
 * nativo de impresión. Así la impresión no arrastra el zoom, los paneles ni
 * el resto de la interfaz del editor.
 */

import { mmToScreenPx } from '@/domain/constants/paperDimensions';

/** Id del nodo DOM de la hoja que se imprime (lo define CanvasArea). */
export const PRINT_SHEET_ID = 'invoice-print-sheet';

/** Tiempo de espera antes de eliminar el iframe tras imprimir. */
const IFRAME_CLEANUP_DELAY_MS = 1000;

/**
 * CSS específico para la impresora: página del tamaño exacto de la hoja
 * (Carta, Media carta, Oficio…) sin márgenes del navegador, hoja a tamaño
 * real y sin ayudas visuales del editor.
 *
 * @param {{widthMm:number, heightMm:number}} paper Medidas reales de la hoja.
 */
const buildPrintCss = ({ widthMm, heightMm }) => `
  @page { size: ${widthMm}mm ${heightMm}mm; margin: 0; }
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #${PRINT_SHEET_ID} {
    width: ${mmToScreenPx(widthMm)}px !important;
    height: ${mmToScreenPx(heightMm)}px !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .no-print { display: none !important; }
  /* Quita los bordes interactivos que react-rnd pone a cada bloque. */
  #${PRINT_SHEET_ID} > div {
    border-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

/**
 * Copia todas las etiquetas de estilo del documento (Tailwind, fuentes…).
 * @returns {string} HTML con las etiquetas <style> y <link rel="stylesheet">.
 */
const collectStyleTags = () =>
  Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((tag) => tag.outerHTML)
    .join('\n');

/**
 * Construye el documento HTML completo que se imprimirá.
 * @param {string} sheetHtml HTML de la hoja clonada.
 * @param {{widthMm:number, heightMm:number}} paper Medidas de la hoja.
 * @returns {string}
 */
const buildPrintDocument = (sheetHtml, paper) => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Imprimir Factura</title>
    ${collectStyleTags()}
    <style>${buildPrintCss(paper)}</style>
  </head>
  <body>${sheetHtml}</body>
</html>`;

/**
 * Imprime la hoja de factura actual.
 *
 * El HTML se captura de forma SÍNCRONA al llamar a esta función, por lo que
 * quien la invoque puede restaurar el estado de la UI (p. ej. salir de vista
 * previa) justo después, sin esperar al diálogo de impresión.
 *
 * @returns {boolean} `true` si se encontró la hoja y se lanzó la impresión.
 */
export const printInvoice = () => {
  const sheet = document.getElementById(PRINT_SHEET_ID);
  if (!sheet) {
    console.error('No se encontró el contenedor de la factura.');
    return false;
  }

  // Iframe invisible que aísla la impresión del resto de la app.
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'absolute',
    width: '0px',
    height: '0px',
    border: 'none',
  });
  document.body.appendChild(iframe);

  // El handler se registra ANTES de escribir el documento: si se asigna
  // después de `close()`, el evento `load` puede haberse disparado ya (ocurre
  // cuando todos los estilos son <style> en línea, como en desarrollo) y la
  // impresión no llegaría a ejecutarse.
  iframe.onload = () => {
    // Algunos navegadores disparan también el `load` del about:blank inicial;
    // se ignora hasta que la hoja clonada esté realmente en el documento.
    if (!iframe.contentDocument?.getElementById(PRINT_SHEET_ID)) return;
    iframe.onload = null; // Garantiza una única impresión.

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    // `print()` bloquea hasta cerrar el diálogo; luego se libera el iframe.
    setTimeout(() => iframe.remove(), IFRAME_CLEANUP_DELAY_MS);
  };

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  // Medidas publicadas por InvoiceSheet (data-width-mm / data-height-mm); Carta si faltan.
  const paper = {
    widthMm: Number(sheet.dataset.widthMm) || 216,
    heightMm: Number(sheet.dataset.heightMm) || 279,
  };
  iframeDoc.write(buildPrintDocument(sheet.outerHTML, paper));
  iframeDoc.close();

  return true;
};
