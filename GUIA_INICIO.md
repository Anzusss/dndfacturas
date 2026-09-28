# Guía de inicio: qué hacer al llegar al trabajo

Paso a paso para poner en marcha dndFacturas en el ordenador del trabajo, conectar la API de
Dynamics cuando la entreguen y saber qué preguntar. Marca cada casilla al terminarla.

---

## 1. Comprobar requisitos (5 min)

Abre una terminal y ejecuta:

```bash
git --version
node --version      # debe ser 24 o superior (lo exige NestJS 12)
docker --version
docker compose version
```

- [ ] **Git** instalado.
- [ ] **Node.js 24+** (si es menor: https://nodejs.org, versión LTS más reciente).
- [ ] **Docker Desktop** instalado y **abierto** (el icono de la ballena debe estar en verde).
- [ ] (Opcional) **Postman** para probar la API de Dynamics.

> Si en el trabajo no se puede instalar Docker, la app funciona igual en modo local
> (`npm run dev`, guarda en el navegador); solo no tendrás base de datos ni backend.

---

## 2. Obtener el código (2 min)

**Si el proyecto no está clonado en ese ordenador:**

```bash
git clone https://github.com/Anzusss/dndfacturas
cd dndfacturas
```

**Si ya estaba clonado:**

```bash
cd dndfacturas
git switch main
git pull
```

- [ ] Estás en la rama `main` y `git log --oneline -1` muestra el último commit.

---

## 3. Instalar dependencias (3–5 min)

```bash
npm install                  # frontend
npm --prefix backend install # backend
```

- [ ] Ambos terminan sin errores (los avisos `npm warn` se pueden ignorar).

---

## 4. Configuración (opcional para empezar)

Los valores por defecto ya funcionan en desarrollo. Solo haz esto si necesitas cambiar algo:

```bash
cp .env.example .env                  # credenciales/puertos de la base de datos
cp backend/.env.example backend/.env  # URL y token de Dynamics, CORS, BD
```

- [ ] Si el puerto **5432** ya está ocupado por otro PostgreSQL, cambia `POSTGRES_PORT` en `.env`
      **y** `DB_PORT` en `backend/.env` al mismo valor (p. ej. 5433).

> Los archivos `.env` no se suben a git. **Nunca** pongas tokens reales en `.env.example`
> ni en `.env.backend`.

---

## 5. Levantar todo (usa 4 terminales)

| Terminal | Comando | Comprobación |
|---|---|---|
| 1 | `npm run db:up` | `docker compose ps` → `dndfacturas-db` en *healthy* |
| 2 | `npm run backend:dev` | http://localhost:3000/api/health → `{"status":"ok","database":"ok"}` |
| 3 | `npm run mock-api` | http://localhost:3001/facturas → lista de facturas de prueba |
| 4 | `npm run dev:backend` | http://localhost:5173 abre el editor |

- [ ] La base de datos crea las tablas sola la primera vez (lo verás en Adminer: http://localhost:8080,
      sistema *PostgreSQL*, servidor `db`, usuario/contraseña/BD `dndfacturas` / `dndfacturas_dev` / `dndfacturas`).
- [ ] La documentación de la API abre en http://localhost:3000/api/docs.

---

## 6. Prueba rápida de que todo funciona (5 min)

1. [ ] **Plantillas**: aparecen "Factura Fiscal Crédito" y "Factura Fiscal Contado", ambas aprobadas y activas.
2. [ ] Con el rol simulado **Diseñador**: abre una plantilla → **Crear nueva versión** → mueve un bloque →
       **Guardar** → **Enviar a revisión**.
3. [ ] Cambia el rol a **Gerente** → en Plantillas pulsa **Aprobar** y actívala en "Plantilla activa por tipo".
4. [ ] **Imprimir**: busca `SERIE H 0000255` (crédito) o `SERIE H 0000256` (contado). Debe salir la vista
       previa con "Vía backend".
5. [ ] **Auditoría**: aparecen la impresión y los cambios de la plantilla.

Si todo esto funciona, el entorno está listo.

---

## 7. Cuando entreguen la API de Dynamics

### 7.1. Pedir estos datos

- [ ] URL del endpoint para obtener una factura por número.
- [ ] Cómo se autentica (token, usuario/clave, VPN, IP permitida…).
- [ ] **Un JSON de ejemplo real de una factura de crédito y otro de contado.** Es lo más importante.
- [ ] En qué campo viene el tipo (crédito / contado) y con qué valores exactos.
- [ ] Si los importes vienen como números (`564.4`) o como texto ya formateado (`"US$ 564.40"`).
- [ ] Si la tasa BCV y los montos en bolívares vienen calculados.

### 7.2. Probarla primero en Postman

1. [ ] Importa `mock-api/dndfacturas.postman_collection.json`.
2. [ ] En la colección, cambia la variable `baseUrl` por la URL de la empresa y añade la autenticación
       que te indiquen.
3. [ ] Lanza "Factura de crédito" y guarda la respuesta JSON en un archivo (te servirá de referencia).

### 7.3. Adaptar la traducción del JSON (el único archivo que depende de Dynamics)

1. [ ] En la app, página **Imprimir** → **Pegar JSON** → pega el JSON real → **Cargar JSON**.
2. [ ] Abre **"Datos técnicos"**: a la izquierda el JSON recibido, a la derecha cómo se tradujo.
3. [ ] Edita `src/services/invoiceApi/dynamicsInvoiceMapper.js`:
   - `DYNAMICS_FIELD_MAP`: para cada campo, la **ruta** donde viene en el JSON real
     (con puntos para objetos anidados, p. ej. `'cliente.razonSocial'`).
   - `INVOICE_TYPE_ALIASES`: los códigos reales de crédito y contado.
4. [ ] Repite el paso 1 hasta que el aviso "La plantilla usa campos que la factura no trae" desaparezca
       (o solo queden campos que de verdad no existan).
5. [ ] (Recomendado) Sustituye los ejemplos de `src/services/invoiceApi/mockInvoices.js` por el JSON real,
       para poder seguir probando sin conexión.

### 7.4. Conectar el backend a la API real

1. [ ] En `backend/.env`:
   ```
   DYNAMICS_API_URL=https://servidor-de-la-empresa/ruta/facturas/{numero}
   DYNAMICS_API_TOKEN=el-token-que-te-den
   ```
2. [ ] Si la autenticación no es `Authorization: Bearer <token>`, ajusta las cabeceras en
       `backend/src/modules/invoices/invoices.service.ts`.
3. [ ] Reinicia el backend (Ctrl+C y `npm run backend:dev`) y busca una factura real en **Imprimir**.
4. [ ] Si cambiaste `INVOICE_TYPE_ALIASES`, actualiza también la tabla `invoice_types` (columna
       `dynamics_aliases`) desde Adminer, o ejecuta `npm run db:seed` y `npm run db:reset`
       (**ojo: `db:reset` borra todos los datos**).

---

## 8. Preguntas pendientes para la empresa

- [ ] **Tipos de factura**: ¿solo crédito y contado? ¿Qué código usa Dynamics para cada uno?
- [ ] **Hoja física**: medir la "media carta" que usan (¿216 × 140 mm?, ¿horizontal?) y el alto del
      membrete, para ajustar márgenes (el diseño base de media carta usa 25 mm arriba y 15 mm abajo, supuestos).
- [ ] **Facturas largas**: si no caben en una hoja, ¿varias hojas (cada una con su nº de control) o máximo de renglones?
- [ ] **Reimpresiones**: ¿deben marcarse como "COPIA"? ¿Hay límite de reimpresiones?
- [ ] **Permisos**: ¿quién imprime? (hoy pueden diseñador y gerente). ¿La gerente aprobará desde esta app?
- [ ] **Plantilla de la empresa**: ¿cuándo la entregan y con qué tecnología (React, React Router, Tailwind)?
- [ ] **Inicio de sesión**: ¿cómo se autentican los usuarios (SSO, JWT, Active Directory…)?
- [ ] **Despliegue**: ¿dónde correrán el backend y la base de datos (servidor propio, Docker, nube)?

---

## 9. Antes de ir a producción (no olvidar)

- [ ] **Sustituir la autenticación simulada** (cabeceras `X-User-Email` / `X-User-Role`, que cualquiera
      puede falsificar) por el inicio de sesión real:
  - Backend: `resolveUser` en `backend/src/common/auth/mock-auth.guard.ts`.
  - Frontend: `buildUserHeaders` en `src/services/backend/httpClient.js`, y quitar `RoleSwitcher`.
- [ ] Contraseñas reales de base de datos (no `dndfacturas_dev`) y `CORS_ORIGIN` con el dominio real.
- [ ] Integrar en la plantilla de la empresa: su router monta `featureRoutes` de `src/routes/appRoutes.jsx`
      dentro de su `<Outlet/>` (ver README, "Integración en la plantilla de la empresa").

---

## 10. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `port is already allocated` al hacer `db:up` | Otro programa usa 5432/8080: cambia `POSTGRES_PORT`/`ADMINER_PORT` en `.env` (y `DB_PORT` en `backend/.env`). |
| No aparecen las tablas | El volumen ya existía de antes. `npm run db:reset` las recrea (**borra los datos**). |
| El backend no arranca: error de Node | Necesitas Node 24+. |
| El backend no arranca: "Variables de entorno inválidas" | Revisa `backend/.env` (el mensaje dice qué variable falla). |
| "No se pudo conectar con el backend" en la app | ¿Está corriendo `npm run backend:dev`? ¿Abriste la app con `npm run dev:backend`? |
| Error de CORS en la consola del navegador | Añade la URL del frontend a `CORS_ORIGIN` en `backend/.env` y reinicia el backend. |
| "No se pudo conectar con la API de Dynamics" | Revisa `DYNAMICS_API_URL`; en local, ¿está corriendo `npm run mock-api`? |
| Los datos "desaparecen" | `npm run dev` guarda en el navegador y `npm run dev:backend` en PostgreSQL: son datos distintos. |
| Error raro en `03_test_database.sh` al crear la BD | El archivo quedó con finales de línea de Windows. Bórralo y recupéralo de git (`.gitattributes` lo restaura con LF): `rm database/init/03_test_database.sh && git checkout -- database/init/03_test_database.sh`, y luego `npm run db:reset`. |

---

## 11. Comandos de referencia

| Comando | Qué hace |
|---|---|
| `npm run dev` | Frontend sin backend (localStorage) |
| `npm run dev:backend` | Frontend usando el backend |
| `npm run backend:dev` | Backend con recarga automática |
| `npm run mock-api` | "Dynamics" simulado en el puerto 3001 |
| `npm run db:up` / `db:down` | Levanta / detiene la base de datos (conserva datos) |
| `npm run db:reset` | Borra la base de datos y la recrea desde los scripts |
| `npm run db:seed` | Regenera los datos iniciales desde el código |
| `npm run lint` / `npm run build` | Revisión y build del frontend |
| `npm run backend:test` | Tests unitarios y e2e del backend |

## 12. Forma de trabajar con git

Para cada cambio nuevo, crea una rama desde `main` y súbela; luego únela con un pull request:

```bash
git switch main && git pull
git switch -c feature/nombre-del-cambio
# ... cambios ...
git add -A && git commit -m "Describe el cambio"
git push -u origin feature/nombre-del-cambio
```
