# Contrato de API: Gestor de Formatos

## 1. Listar Formatos
- **Ruta:** `GET /api/formats`
- **Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "message": "Formatos listados correctamente",
  "data": [
    {
      "id": "uuid-1234",
      "name": "Factura Legal USD",
      "description": "Plantilla para facturas en dólares",
      "document_type_id": 3,
      "active_version_id": "uuid-v1",
      "created_at": "2026-09-24T10:00:00Z"
    }
  ]
}
```

## 2. Crear Formato (Borrador Inicial)
- **Ruta:** `POST /api/formats`
- **Body:**
```json
{
  "name": "Nota de Crédito Dólares",
  "description": "Formato para notas de crédito devueltas",
  "document_type_id": 4
}
```
- **Respuesta (201 Created):** Retorna el ID generado y el ID de la primera versión vacía.

## 3. Obtener Formato (con su layout activo)
- **Ruta:** `GET /api/formats/{id}`
- **Respuesta (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-1234",
    "name": "Factura Legal USD",
    "document_type_id": 3,
    "active_layout": {
      "elements": [
        {"type": "text", "value": "Factura Nro", "x": 10, "y": 20}
      ]
    }
  }
}
```

## 4. Guardar Nueva Versión de Diseño
- **Ruta:** `POST /api/formats/{id}/versions`
- **Body:**
```json
{
  "layout_json": {
     "elements": [
        {"type": "variable", "field": "customer_name", "x": 50, "y": 100}
     ]
  }
}
```
- **Respuesta (201 Created):** Retorna el nuevo `version_number` que ahora es el activo.

## 5. Historial de Versiones
- **Ruta:** `GET /api/formats/{id}/versions`
- **Respuesta (200 OK):** Lista de versiones (`version`, `status`, `created_at`).
