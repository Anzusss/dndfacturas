-- =============================================================================
-- dndFacturas · Datos iniciales
--
-- ARCHIVO GENERADO por database/scripts/generate-seed.mjs (npm run db:seed).
-- No lo edites a mano: cambia el código del dominio y vuelve a generarlo.
--
-- Se ejecuta automáticamente después de 01_schema.sql al crear la base de datos.
-- =============================================================================

BEGIN;

-- Tipos de factura y sus códigos en Dynamics
INSERT INTO invoice_types (code, label, dynamics_aliases) VALUES
  ('CREDITO', 'Crédito', ARRAY['CREDITO', 'CREDIT']::text[]),
  ('CONTADO', 'Contado', ARRAY['CONTADO', 'CASH']::text[]);

-- Plantillas por defecto (versión 1, aprobadas)
INSERT INTO invoice_templates (
  template_id, version, name, invoice_type, status,
  schema_version, page_setup,
  elements,
  created_by, updated_by, approved_by, approved_at
) VALUES
  ('factura-fiscal-real-v1', 1, 'Factura Fiscal Crédito (Formato Carta)', 'CREDITO', 'APROBADA',
   1, '{"size":"LETTER","orientation":"portrait","width":"216mm","minHeight":"279mm","paddingTop":"50mm","paddingBottom":"40mm","paddingLeft":"15mm","paddingRight":"15mm","fontFamily":"''Courier New'', Courier, monospace"}'::jsonb,
   '[{"id":"client-info-block","type":"grid","title":"Datos del Cliente","x":57,"y":195,"width":440,"height":115,"fields":["cliente","rif","direccion","telefono"]},{"id":"doc-info-block","type":"grid","title":"Control de Documento","x":520,"y":195,"width":239,"height":95,"fields":["facturaNo","fecha","pago"]},{"id":"items-table-block","type":"table","title":"Tabla de Bienes / Servicios","x":57,"y":330,"width":702,"height":140,"columns":[{"label":"Cantidad","field":"cantidad","align":"left"},{"label":"UM","field":"um","align":"left"},{"label":"Descripción del Bien/Servicio","field":"descripcion","align":"left"},{"label":"Precio/Tarifa (US$)","field":"precioUsd","align":"right"},{"label":"Sub-total (US$)","field":"subtotalUsd","align":"right"},{"label":"Sub-total (Bs.)","field":"subtotalBs","align":"right"}]},{"id":"legal-text-block","type":"text","title":"Leyenda Legal IGTF y Tasa BCV","x":57,"y":540,"width":702,"height":120,"content":"De cancelar este documento en moneda distinta a la de curso legal en el país, estará sujeta a la percepción del I.G.T.F. del 3% según lo establecido en la Providencia SNAT/2022/000013 de fecha 03/03/2022, la cual podría llegar hasta el monto de {{montoIgtfBs}}\n\nTasa de cambio reflejada por el Banco Central de Venezuela a la fecha {{fecha}}\nTasa: {{tasaCambio}}\nMunicipio: {{municipio}}"},{"id":"totals-section-block","type":"totals","title":"Resumen de Totales y Liquidación","x":379,"y":680,"width":380,"height":155,"totalsRows":[{"label":"Base Imponible:","usdKey":"totales.baseImponibleUsd","bsKey":"totales.baseImponibleBs"},{"label":"I.V.A. 16%:","usdKey":"totales.ivaUsd","bsKey":"totales.ivaBs"},{"label":"Exento:","usdKey":"totales.exentoUsd","bsKey":"totales.exentoBs"},{"label":"Total General:","usdKey":"totales.totalGeneralUsd","bsKey":"totales.totalGeneralBs","isBold":true},{"label":"I.G.T.F. 3%:","usdKey":"totales.igtfUsd","bsKey":"totales.igtfBs"}]}]'::jsonb,
   'sistema', 'sistema', 'sistema', now()),
  ('factura-contado-v1', 1, 'Factura Fiscal Contado (Formato Carta)', 'CONTADO', 'APROBADA',
   1, '{"size":"LETTER","orientation":"portrait","width":"216mm","minHeight":"279mm","paddingTop":"50mm","paddingBottom":"40mm","paddingLeft":"15mm","paddingRight":"15mm","fontFamily":"''Courier New'', Courier, monospace"}'::jsonb,
   '[{"id":"client-info-block","type":"grid","title":"Datos del Cliente","x":57,"y":195,"width":440,"height":115,"fields":["cliente","rif","direccion","telefono"]},{"id":"doc-info-block","type":"grid","title":"Control de Documento","x":520,"y":195,"width":239,"height":95,"fields":["facturaNo","fecha","pago"]},{"id":"items-table-block","type":"table","title":"Tabla de Bienes / Servicios","x":57,"y":330,"width":702,"height":140,"columns":[{"label":"Cantidad","field":"cantidad","align":"left"},{"label":"UM","field":"um","align":"left"},{"label":"Descripción del Bien/Servicio","field":"descripcion","align":"left"},{"label":"Precio/Tarifa (US$)","field":"precioUsd","align":"right"},{"label":"Sub-total (US$)","field":"subtotalUsd","align":"right"},{"label":"Sub-total (Bs.)","field":"subtotalBs","align":"right"}]},{"id":"legal-text-block","type":"text","title":"Leyenda Legal IGTF y Tasa BCV","x":57,"y":540,"width":702,"height":120,"content":"De cancelar este documento en moneda distinta a la de curso legal en el país, estará sujeta a la percepción del I.G.T.F. del 3% según lo establecido en la Providencia SNAT/2022/000013 de fecha 03/03/2022, la cual podría llegar hasta el monto de {{montoIgtfBs}}\n\nTasa de cambio reflejada por el Banco Central de Venezuela a la fecha {{fecha}}\nTasa: {{tasaCambio}}\nMunicipio: {{municipio}}"},{"id":"totals-section-block","type":"totals","title":"Resumen de Totales y Liquidación","x":379,"y":680,"width":380,"height":155,"totalsRows":[{"label":"Base Imponible:","usdKey":"totales.baseImponibleUsd","bsKey":"totales.baseImponibleBs"},{"label":"I.V.A. 16%:","usdKey":"totales.ivaUsd","bsKey":"totales.ivaBs"},{"label":"Exento:","usdKey":"totales.exentoUsd","bsKey":"totales.exentoBs"},{"label":"Total General:","usdKey":"totales.totalGeneralUsd","bsKey":"totales.totalGeneralBs","isBold":true},{"label":"I.G.T.F. 3%:","usdKey":"totales.igtfUsd","bsKey":"totales.igtfBs"}]}]'::jsonb,
   'sistema', 'sistema', 'sistema', now());

-- Plantilla activa de cada tipo
INSERT INTO active_templates (invoice_type, template_id, template_version, activated_by) VALUES
  ('CREDITO', 'factura-fiscal-real-v1', 1, 'sistema'),
  ('CONTADO', 'factura-contado-v1', 1, 'sistema');

-- Historial inicial
INSERT INTO template_history (template_id, version, template_name, invoice_type, action, user_email, comment) VALUES
  ('factura-fiscal-real-v1', 1, 'Factura Fiscal Crédito (Formato Carta)', 'CREDITO', 'CREADA', 'sistema', 'Plantilla inicial'),
  ('factura-fiscal-real-v1', 1, 'Factura Fiscal Crédito (Formato Carta)', 'CREDITO', 'APROBADA', 'sistema', NULL),
  ('factura-fiscal-real-v1', 1, 'Factura Fiscal Crédito (Formato Carta)', 'CREDITO', 'ACTIVADA', 'sistema', 'Activa para facturas de Crédito'),
  ('factura-contado-v1', 1, 'Factura Fiscal Contado (Formato Carta)', 'CONTADO', 'CREADA', 'sistema', 'Plantilla inicial'),
  ('factura-contado-v1', 1, 'Factura Fiscal Contado (Formato Carta)', 'CONTADO', 'APROBADA', 'sistema', NULL),
  ('factura-contado-v1', 1, 'Factura Fiscal Contado (Formato Carta)', 'CONTADO', 'ACTIVADA', 'sistema', 'Activa para facturas de Contado');

COMMIT;
