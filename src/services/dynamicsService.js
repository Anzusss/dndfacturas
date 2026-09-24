/**
 * Servicio simulador de integración con Microsoft Dynamics ERP
 * con la estructura y datos fiscales reales provistos.
 */
export const dynamicsService = {
  async getInvoiceData(invoiceId = 'SERIE H 0000255') {
    return {
      cliente: 'LA CASA DEL GRANJERO C.A (LA CASA DEL GRANJERO C.A)',
      rif: 'J-30199938-0',
      direccion: 'CALLE ACOSTA EDIF ELICON PISO PB LOCAL S/N SECTOR MERCADO MUNICIPAL CARUPANO SUCRE',
      telefono: '(412) 760-9195 Ext. 0000',
      facturaNo: invoiceId,
      fecha: '18/02/2026',
      pago: 'CREDITO 07 DIAS',
      tasaCambio: '396,3674 Bs/$',
      municipio: 'Iribarren',
      providenciaIGTF: 'Providencia SNAT/2022/000013 de fecha 03/03/2022',
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
    };
  },
};
