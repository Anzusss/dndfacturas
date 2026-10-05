# GP Print Studio

## 🎯 Propósito del Sistema

Este proyecto está diseñado para la **gestión de impresiones de facturas, notas de crédito y notas de débito** provenientes del sistema **Microsoft Dynamics GP 2018**. 

Su objetivo principal es brindar una herramienta centralizada que facilite:
- 🎨 **Gestión de Formatos:** Creación y modificación ágil de nuevos formatos de impresión.
- 📜 **Auditoría e Historial:** Mantener un registro histórico detallado de qué documento específico se imprimió y cuándo.
- 🧮 **Control de Impresiones:** Un contador exacto de cuántas veces se ha impreso cada documento para llevar un control estricto y evitar duplicidades no autorizadas.

## 🚀 Tecnologías Principales

### Backend
- **Framework:** [CodeIgniter 4](https://codeigniter.com/)
- **Entorno:** Dockerizado (contenedores listos para desarrollo local)
- **Base de Datos Principal:** PostgreSQL (Para la gestión interna de usuarios, historiales y formatos de la app)
- **Base de Datos Secundaria:** SQL Server (Para integración y consulta de datos con Microsoft Dynamics GP)

### Frontend
- **Librería Core:** React (empaquetado con Vite)
- **Plantilla Base:** [AdminTemplate de Serex](https://bitbucket.org/gruposerex/admin-template-serex/src)
- **Librería de Componentes UI:** [`@gruposerex/ui`](https://bitbucket.org/gruposerex/serex-ui/src/master/) (instalada vía Bitbucket)
- **Lenguaje:** TypeScript para mayor seguridad de tipos y escalabilidad.

## 📁 Estructura del Proyecto

El proyecto está dividido en los siguientes módulos principales:

- **`/gp-print-studio-backend`**: Contiene el código fuente de la API (CodeIgniter 4) y la configuración de Docker (`docker-compose.yml`) que orquesta los contenedores de PHP, PostgreSQL y SQL Server.
- **`/frontend`**: Contiene la aplicación web en React configurada con la plantilla de administración y conectada a la librería de diseño.
- **`/docs`**: Carpeta destinada para documentación técnica, diagramas o notas adicionales del proyecto.

## ⚙️ Requisitos Previos

Antes de levantar el entorno de desarrollo, asegúrate de tener instalados:

- [Docker](https://www.docker.com/) y Docker Compose.
- [Node.js](https://nodejs.org/) (versión LTS) y `npm` para gestionar las dependencias del frontend.
- Git (y credenciales configuradas para acceder a Bitbucket y poder descargar dependencias privadas como `@gruposerex/ui`).

## 🛠️ Instalación y Uso para Desarrollo

### 1. Iniciar el Backend y Bases de Datos

Dirígete a la carpeta del backend y levanta los servicios utilizando Docker. La primera vez debes usar `--build` para que PHP instale las extensiones necesarias para conectarse a PostgreSQL y SQL Server.

```bash
cd gp-print-studio-backend
# Levantar el entorno y construir la imagen de PHP
docker-compose up -d --build

# Para ejecutar las migraciones de la base de datos de PostgreSQL
docker exec -it gp-print-studio-backend php spark migrate
```
*(Asegúrate de haber configurado tu archivo `.env` en la raíz del backend con las credenciales de PostgreSQL y SQL Server, y el `.env.development` dentro de `backend/source` si la aplicación lo requiere).*

### 2. Iniciar el Frontend

Dirígete a la carpeta del frontend, instala las dependencias y corre el entorno de desarrollo local:

```bash
cd frontend
npm install
npm run dev
```

El servidor de Vite se iniciará (usualmente en `http://localhost:5173`) y podrás comenzar a desarrollar la interfaz.

---
**Desarrollado y mantenido por Grupo Serex.**
