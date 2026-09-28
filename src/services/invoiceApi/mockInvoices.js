/**
 * @file Respuestas SIMULADAS de la API de facturas (modo mock).
 *
 * Capa: SERVICIOS (mock). Su forma es una suposición de lo que devolverá la
 * API de la empresa. Cuando llegue el JSON real, lo ideal es pegar aquí un
 * ejemplo real para seguir probando sin conexión.
 *
 * Deliberadamente una factura trae importes como TEXTO formateado y la otra
 * como NÚMEROS, para probar ambos casos.
 */

export const MOCK_INVOICES = {
  // Crédito, importes ya formateados como texto.
  'SERIE H 0000255': {
    tipoFactura: 'CREDITO',
    facturaNo: 'SERIE H 0000255',
    cliente: 'LA CASA DEL GRANJERO C.A (LA CASA DEL GRANJERO C.A)',
    rif: 'J-30199938-0',
    direccion: 'CALLE ACOSTA EDIF ELICON PISO PB LOCAL S/N SECTOR MERCADO MUNICIPAL CARUPANO SUCRE',
    telefono: '(412) 760-9195 Ext. 0000',
    fecha: '18/02/2026',
    pago: 'CREDITO 07 DIAS',
    tasaCambio: '396,3674 Bs/$',
    municipio: 'Iribarren',
    montoIgtfBs: 'Bs 6.711,29',
    items: [
      {
        cantidad: '20,000',
        um: 'SC25',
        descripcion: 'PURICACHAMA 25%',
        precioUsd: 'US$ 28.22',
        subtotalUsd: 'US$ 564.40',
        subtotalBs: 'Bs 223.709,76(E)',
      },
    ],
    totales: {
      baseImponibleUsd: 'US$ 0.00',
      baseImponibleBs: 'Bs 0,00',
      ivaUsd: 'US$ 0.00',
      ivaBs: 'Bs 0,00',
      exentoUsd: 'US$ 0.00',
      exentoBs: 'Bs 0,00',
      totalGeneralUsd: 'US$ 564.40',
      totalGeneralBs: 'Bs 223.709,76',
      igtfUsd: 'US$ 16.93',
      igtfBs: 'Bs 6.711,29',
    },
  },

  // Contado, importes como números (se formatean en la app).
  'SERIE H 0000256': {
    tipoFactura: 'CONTADO',
    facturaNo: 'SERIE H 0000256',
    cliente: 'AGROPECUARIA LOS ANDES C.A.',
    rif: 'J-40123456-7',
    direccion: 'AV. LOS HORCONES CON CALLE 42 GALPON 3 ZONA INDUSTRIAL BARQUISIMETO LARA',
    telefono: '(251) 555-0101',
    fecha: '27/09/2026',
    pago: 'CONTADO',
    tasaCambio: '396,3674 Bs/$',
    municipio: 'Iribarren',
    montoIgtfBs: 2515.66,
    items: [
      { cantidad: 10, um: 'SC25', descripcion: 'PURICACHAMA 25%', precioUsd: 28.22, subtotalUsd: 282.2, subtotalBs: 111854.88 },
      { cantidad: 5, um: 'SC40', descripcion: 'PURIGALLINA PONEDORA', precioUsd: 19.5, subtotalUsd: 97.5, subtotalBs: 38645.82 },
      { cantidad: 2.5, um: 'KG', descripcion: 'VITAMINAS MIX', precioUsd: 12, subtotalUsd: 30, subtotalBs: 11891.02 },
    ],
    totales: {
      baseImponibleUsd: 0,
      baseImponibleBs: 0,
      ivaUsd: 0,
      ivaBs: 0,
      exentoUsd: 409.7,
      exentoBs: 162391.72,
      totalGeneralUsd: 409.7,
      totalGeneralBs: 162391.72,
      igtfUsd: 12.29,
      igtfBs: 4871.75,
    },
  },
};
