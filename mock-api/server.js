/**
 * @file API SIMULADA de facturas para pruebas locales (Node puro, sin dependencias).
 *
 * Sirve por HTTP las mismas facturas de `src/services/invoiceApi/mockInvoices.js`
 * para poder probar:
 * - Desde Postman (colección en `mock-api/dndfacturas.postman_collection.json`).
 * - La app en modo "API real": llamadas HTTP, CORS, errores 404, etc.
 *
 * Uso:
 *   npm run mock-api
 *   # y en .env.local:
 *   VITE_INVOICE_API_URL=http://localhost:3001/facturas/{numero}
 *
 * Endpoints:
 *   GET /facturas            → lista de números disponibles
 *   GET /facturas/:numero    → JSON de la factura (404 si no existe)
 *
 * Cuando llegue la API real, este servidor deja de ser necesario (o puede
 * seguir usándose con el JSON real pegado en mockInvoices.js).
 */

import { createServer } from 'node:http';
import { MOCK_INVOICES } from '../src/services/invoiceApi/mockInvoices.js';

const PORT = Number(process.env.MOCK_API_PORT) || 3001;

/** Latencia artificial para parecerse a una red real. */
const LATENCY_MS = 250;

/** Cabeceras CORS: permiten que el navegador (Vite en :5173) llame a esta API. */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, Authorization, Content-Type',
};

/** Envía una respuesta JSON. */
const sendJson = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS });
  res.end(JSON.stringify(body, null, 2));
};

const server = createServer((req, res) => {
  // Petición "preflight" de CORS que el navegador envía antes de ciertas llamadas.
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const [, resource, rawNumber] = pathname.split('/');
  console.log(`${new Date().toLocaleTimeString()}  ${req.method} ${pathname}`);

  setTimeout(() => {
    if (req.method !== 'GET' || resource !== 'facturas') {
      sendJson(res, 404, { error: 'Ruta no encontrada. Usa GET /facturas/:numero' });
      return;
    }
    if (!rawNumber) {
      sendJson(res, 200, { facturas: Object.keys(MOCK_INVOICES) });
      return;
    }

    const number = decodeURIComponent(rawNumber);
    const invoice = MOCK_INVOICES[number];
    if (invoice) sendJson(res, 200, invoice);
    else sendJson(res, 404, { error: `Factura "${number}" no encontrada` });
  }, LATENCY_MS);
});

server.listen(PORT, () => {
  console.log(`API simulada de facturas en http://localhost:${PORT}/facturas`);
  console.log(`Facturas disponibles: ${Object.keys(MOCK_INVOICES).join(', ')}`);
});
