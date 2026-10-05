# Backend App Starter

Este es el entorno de desarrollo local para el backend. Utiliza Docker y Docker Compose para orquestar un contenedor para la aplicación (PHP/Apache), una base de datos (PostgreSQL) y un gestor gráfico de base de datos (pgAdmin).

## Requisitos Previos

- [Docker](https://www.docker.com/) instalado.
- [Docker Compose](https://docs.docker.com/compose/) instalado.

## Configuración del Entorno (.env)

Antes de levantar el proyecto por primera vez, necesitas definir las variables de entorno. 
Copia el archivo `.env.development` (o crea uno si no existe) en la raíz de la carpeta `backend` y ajusta las variables según tus necesidades.

### Variables Configurables

#### Configuración de la Aplicación
* **`APP_CONTAINER_NAME`**: Nombre que recibirá el contenedor de tu aplicación PHP. (Ej. `app-starter-container`)
* **`APP_PORT`**: Puerto local desde el que accederás a tu aplicación web. (Ej. `8080`) -> Acceso en `http://localhost:8080`

#### Configuración de la Base de Datos (PostgreSQL)
* **`DB_CONTAINER_NAME`**: Nombre del contenedor de la base de datos.
* **`DB_PORT`**: Puerto local expuesto para conectarte a PostgreSQL desde tu máquina host (Ej. `5432`).
* **`POSTGRES_USER`**: Usuario administrador de la base de datos (Ej. `postgres`).
* **`POSTGRES_PASSWORD`**: Contraseña del usuario de la base de datos.
* **`POSTGRES_DB`**: Nombre de la base de datos por defecto que se creará al inicializar el contenedor.

#### Configuración de pgAdmin (Gestor de BD)
* **`PGADMIN_CONTAINER_NAME`**: Nombre del contenedor de pgAdmin.
* **`PGADMIN_PORT`**: Puerto local para acceder a la interfaz web de pgAdmin. (Ej. `5050`) -> Acceso en `http://localhost:5050`
* **`PGADMIN_DEFAULT_EMAIL`**: Correo para iniciar sesión en pgAdmin.
* **`PGADMIN_DEFAULT_PASSWORD`**: Contraseña para iniciar sesión en pgAdmin.

## Ejecución del Proyecto en Local

Dado que estamos utilizando un archivo de variables personalizado (`.env.development`), debemos indicarle a Docker Compose que lo utilice al ejecutar los comandos.

1. Abre tu terminal y ubícate en el directorio `backend`.
2. Ejecuta el siguiente comando para construir y levantar todos los servicios en segundo plano:

```bash
docker-compose --env-file .env.development up -d --build
```

### Detener los servicios

Para detener los contenedores sin borrar los datos, ejecuta:

```bash
docker-compose --env-file .env.development stop
```

Para detener los contenedores y destruirlos (no borrará el volumen de datos de tu base de datos a menos que uses la bandera `-v`), ejecuta:

```bash
docker-compose --env-file .env.development down
```
