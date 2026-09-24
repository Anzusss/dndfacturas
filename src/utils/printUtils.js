/**
 * utils/printUtils.js
 * Captura el lienzo y lo imprime en un entorno aislado.
 */
export const printInvoice = () => {
    // 1. Capturar la hoja del editor
    const sheet = document.getElementById('invoice-print-sheet');
    if (!sheet) {
        console.error("No se encontró el contenedor de la factura.");
        return;
    }

    // 2. Crear un iframe oculto para aislar la impresión
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;

    // 3. Extraer todas las hojas de estilo de la aplicación (Tailwind, Google Fonts, etc.)
    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(tag => tag.outerHTML)
        .join('\n');

    // 4. Inyectar el contenido y los estilos en el iframe
    iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <title>Imprimir Factura</title>
        ${styleTags}
        <style>
          /* Configuraciones estrictas para la impresora */
          @page { 
            size: letter portrait; 
            margin: 0; 
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Asegurar que la hoja ocupe exactamente las medidas de pantalla */
          #invoice-print-sheet {
            width: 816px !important;
            height: 1054px !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            box-shadow: none !important;
          }
          /* Ocultar elementos auxiliares del editor */
          .no-print { 
            display: none !important; 
          }
          /* Quitar bordes interactivos de react-rnd */
          #invoice-print-sheet > div {
            border-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
          }
        </style>
      </head>
      <body>
        ${sheet.outerHTML}
      </body>
    </html>
  `);

    iframeDoc.close();

    // 5. Esperar a que el navegador procese los estilos antes de invocar la impresora
    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // 6. Eliminar el iframe después de imprimir para liberar memoria
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
};