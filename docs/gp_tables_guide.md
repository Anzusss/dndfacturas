# Guía de Tablas - Microsoft Dynamics GP 2018

Esta guía documenta las tablas clave de la base de datos de Dynamics GP (esquema `dbo`) necesarias para consultar y generar formatos personalizados para los módulos solicitados. 

> [!NOTE]
> Dynamics GP utiliza una convención de nombres específica. Las tablas que terminan en `10000` o `10000s` suelen ser de Trabajo (Work/No contabilizadas), las `20000s` son Abiertas (Open/Pendientes) y las `30000s` son Históricas (History/Contabilizadas o Pagadas).

## 1. Ventas (SOP - Sales Order Processing)
Maneja la facturación, pedidos, cotizaciones y devoluciones.

| Tabla | Tipo | Descripción |
|---|---|---|
| **SOP10100** | Cabecera (Trabajo) | Transacciones de ventas no contabilizadas. Contiene el encabezado de facturas (`SOPTYPE=3`), pedidos (`SOPTYPE=2`), cotizaciones (`SOPTYPE=1`), etc. |
| **SOP10200** | Detalle (Trabajo) | Líneas de detalle (artículos) de las transacciones en SOP10100. |
| **SOP30200** | Cabecera (Histórico) | Facturas y devoluciones que ya han sido contabilizadas (Posted). |
| **SOP30300** | Detalle (Histórico) | Líneas de detalle de las facturas contabilizadas. |

## 2. Cobranzas (RM - Receivables Management)
Maneja las cuentas por cobrar a clientes y los recibos de pago.

| Tabla | Tipo | Descripción |
|---|---|---|
| **RM10201** | Trabajo | Recibos de caja (Cobranzas) que han sido ingresados en un lote pero aún no se contabilizan. |
| **RM20101** | Abiertas | Documentos por cobrar con saldo pendiente (Facturas, Notas de Débito, Pagos a cuenta no aplicados). |
| **RM30101** | Histórico | Documentos por cobrar que ya fueron pagados en su totalidad y movidos al histórico. |

## 3. Pagos a Proveedores (PM - Payables Management)
Maneja las cuentas por pagar y la emisión de cheques/transferencias.

| Tabla | Tipo | Descripción |
|---|---|---|
| **PM10200** | Trabajo | Transacciones de pago (Work) pendientes de ser contabilizadas. |
| **PM20000** | Abiertas | Facturas de proveedores con saldo pendiente por pagar. |
| **PM30200** | Histórico | Facturas de proveedores que ya fueron pagadas en su totalidad, y el registro del pago contabilizado. |

## 4. Impuestos (TX)
Almacena las configuraciones y los montos calculados.

| Tabla | Tipo | Descripción |
|---|---|---|
| **TX00201** | Maestro | Catálogo de detalles de impuestos (Tasas, porcentajes). |
| **SOP10105** | Trabajo | Desglose de impuestos por cada factura/pedido en el módulo de Ventas (SOP). |
| **POP10305** | Trabajo | Desglose de impuestos para las recepciones/facturas en el módulo de Compras (POP). |

> [!TIP]
> **Esquema Completo Exportado:** He ejecutado una consulta en tu base de datos `PSGMC` para extraer todas las columnas, tipos de datos y longitudes de estas tablas. El resultado completo se ha guardado en tu proyecto en: [gp_schema.md](file:///c:/Projects/Grupo%20Serex/notification-service/docs/gp_schema.md).
