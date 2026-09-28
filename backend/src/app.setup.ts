/**
 * @file Configuración global de la aplicación HTTP.
 *
 * Separada de main.ts para que los tests e2e levanten la app exactamente
 * igual que en ejecución normal.
 */

import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter.js';
import { AUTH_HEADERS } from './common/auth/auth.types.js';
import type { EnvironmentVariables } from './config/env.validation.js';

/** Prefijo de todas las rutas: /api/templates, /api/print-logs… */
export const API_PREFIX = 'api';

/**
 * Aplica prefijo, CORS, validación, filtros y documentación Swagger.
 * @param app Aplicación Nest ya creada.
 */
export const configureApp = (app: INestApplication): void => {
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  app.setGlobalPrefix(API_PREFIX);

  // Las plantillas pueden ocupar más que el límite por defecto de Express (100 KB).
  (app as NestExpressApplication).useBodyParser('json', { limit: '2mb' });

  // Solo el frontend configurado puede llamar a la API desde el navegador.
  app.enableCors({
    origin: config.get('CORS_ORIGIN', { infer: true }).split(',').map((origin) => origin.trim()),
    allowedHeaders: ['Content-Type', 'Accept', AUTH_HEADERS.EMAIL, AUTH_HEADERS.ROLE],
  });

  // Valida los DTOs y descarta los campos que no estén declarados en ellos.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Errores de PostgreSQL (triggers) → respuestas HTTP comprensibles.
  app.useGlobalFilters(new DatabaseExceptionFilter());

  // Documentación interactiva en /api/docs (útil junto con Postman).
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('dndFacturas API')
      .setDescription(
        'Plantillas de factura, plantilla activa por tipo, auditoría de impresiones y proxy a Dynamics.\n\n' +
          'Autenticación SIMULADA: envía las cabeceras `X-User-Email` y `X-User-Role` (DISENADOR o GERENTE).',
      )
      .setVersion('1.0')
      .addApiKey({ type: 'apiKey', in: 'header', name: 'X-User-Email' }, 'userEmail')
      .addApiKey({ type: 'apiKey', in: 'header', name: 'X-User-Role' }, 'userRole')
      .addSecurityRequirements('userEmail')
      .addSecurityRequirements('userRole')
      .build(),
  );
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, document);
};
