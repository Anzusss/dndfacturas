/**
 * @file Respuestas SIMULADAS de la API de facturas (modo mock y `npm run mock-api`).
 *
 * Capa: SERVICIOS (mock). Tienen EXACTAMENTE el formato real de la API de
 * Dynamics (septiembre 2026), con espacios de relleno e importes como texto.
 *
 * - 0008894: factura REAL de producción en bolívares, de contado. Los datos del
 *   cliente (nombre, RIF, dirección, referencias) están ANONIMIZADOS; los
 *   importes son los reales. Incluye la incoherencia de `exempt_total_*`.
 * - 0008900: factura INVENTADA en dólares, a crédito (15 días), con un renglón
 *   exento e IGTF, para probar la otra moneda y el cálculo de base/exento.
 *
 * No guardes aquí datos reales de clientes: este archivo se sube a git.
 */

export const MOCK_INVOICES = {
  "0008894": {
    "status": "success",
    "message": "Detalles del documento recuperados",
    "data": {
      "document_number": "0008894              ",
      "document_date": "2026-01-20",
      "due_date": "2026-01-20",
      "customer_name": "CLIENTE DE PRUEBA GRANOS, C.A.",
      "rif": "J-00000000-1",
      "address": "AV. PRINCIPAL CRUCE CON CALLE 1 EDIF. EJEMPLO NIVEL PB OF 01 MARACAY",
      "phone": "                     ",
      "currency_id": "VES            ",
      "exchange_rate": ".0000000",
      "reference": "                               ",
      "net_total_transaction": "19358955.00000",
      "discount_transaction": ".00000",
      "tax_total_transaction": "3097432.80000",
      "exempt_total_transaction": "19358955.00000",
      "igtf_transaction": "0.00000",
      "grand_total_transaction": "22456387.80000",
      "net_total_functional": "19358955.00000",
      "discount_functional": ".00000",
      "tax_total_functional": "3097432.80000",
      "exempt_total_functional": "19358955.00000",
      "igtf_functional": "0.00000",
      "grand_total_functional": "22456387.80000",
      "document_type_id": 3,
      "lines": [
        {
          "quantity": "7700.00000",
          "item_description": "DESCARGA DE TRIGO",
          "unit_price_transaction": "2477.81000",
          "subtotal_transaction": "19079137.00000",
          "tax_transaction": "3052661.92000",
          "unit_price_functional": "2477.81000",
          "subtotal_functional": "19079137.00000",
          "tax_functional": "3052661.92000"
        },
        {
          "quantity": "7700.00000",
          "item_description": "SERVICIOS RELACIONADOS A LA LOGISTICA",
          "unit_price_transaction": "36.34000",
          "subtotal_transaction": "279818.00000",
          "tax_transaction": "44770.88000",
          "unit_price_functional": "36.34000",
          "subtotal_functional": "279818.00000",
          "tax_functional": "44770.88000"
        }
      ],
      "payments": [
        {
          "payment_number": "COB0000011           ",
          "apply_date": "2026-01-20",
          "applied_amount_transaction": "22069248.29000",
          "applied_amount_functional": "22069248.29000",
          "bank_account": "",
          "currency_id": "VES",
          "payment_date": "2026-01-13",
          "reference": "ANTICIPO DE PRUEBA",
          "applied_igtf_functional": "0.00000",
          "applied_igtf_transaction": "0.00000"
        },
        {
          "payment_number": "NC0000012            ",
          "apply_date": "2026-01-20",
          "applied_amount_transaction": "387139.51000",
          "applied_amount_functional": "387139.51000",
          "bank_account": "",
          "currency_id": "VES",
          "payment_date": "2026-01-20",
          "reference": "RET ISLR FA 8894",
          "applied_igtf_functional": "0.00000",
          "applied_igtf_transaction": "0.00000"
        }
      ]
    }
  },
  "0008900": {
    "status": "success",
    "message": "Detalles del documento recuperados",
    "data": {
      "document_number": "0008900              ",
      "document_date": "2026-09-28",
      "due_date": "2026-10-13",
      "customer_name": "AGROPECUARIA EJEMPLO, C.A.",
      "rif": "J-00000000-2",
      "address": "CARRETERA NACIONAL KM 5 GALPON 3 ZONA INDUSTRIAL BARQUISIMETO LARA",
      "phone": "(251) 555-0101       ",
      "currency_id": "USD            ",
      "exchange_rate": "396.3674000",
      "reference": "                               ",
      "net_total_transaction": "342.20000",
      "discount_transaction": ".00000",
      "tax_total_transaction": "45.15000",
      "exempt_total_transaction": "60.00000",
      "igtf_transaction": "11.62000",
      "grand_total_transaction": "387.35000",
      "net_total_functional": "135636.92000",
      "discount_functional": ".00000",
      "tax_total_functional": "17895.99000",
      "exempt_total_functional": "23782.04000",
      "igtf_functional": "4605.79000",
      "grand_total_functional": "153532.91000",
      "document_type_id": 3,
      "lines": [
        {
          "quantity": "10.00000",
          "item_description": "PURICACHAMA 25%",
          "unit_price_transaction": "28.22000",
          "subtotal_transaction": "282.20000",
          "tax_transaction": "45.15000",
          "unit_price_functional": "11185.49000",
          "subtotal_functional": "111854.88000",
          "tax_functional": "17895.99000"
        },
        {
          "quantity": "5.00000",
          "item_description": "VITAMINAS MIX (EXENTO)",
          "unit_price_transaction": "12.00000",
          "subtotal_transaction": "60.00000",
          "tax_transaction": "0.00000",
          "unit_price_functional": "4756.41000",
          "subtotal_functional": "23782.04000",
          "tax_functional": "0.00000"
        }
      ],
      "payments": []
    }
  }
};
