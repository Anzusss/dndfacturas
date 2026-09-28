/**
 * @file Configuración de TypeORM.
 *
 * IMPORTANTE: `synchronize` está desactivado. El esquema de la base de datos
 * (tablas, triggers, vistas) lo crean los scripts SQL de `database/init/`
 * (docker-compose). TypeORM solo se conecta y mapea las tablas existentes;
 * nunca las crea ni las modifica.
 */

import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { EnvironmentVariables } from './env.validation.js';

/**
 * Construye las opciones de conexión a partir de las variables de entorno.
 * @param config Servicio de configuración de Nest.
 */
export const buildTypeOrmOptions = (config: ConfigService<EnvironmentVariables, true>): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', { infer: true }),
  port: config.get('DB_PORT', { infer: true }),
  database: config.get('DB_NAME', { infer: true }),
  username: config.get('DB_USER', { infer: true }),
  password: config.get('DB_PASSWORD', { infer: true }),
  autoLoadEntities: true, // Registra las entidades de cada módulo (TypeOrmModule.forFeature).
  synchronize: false,     // El esquema lo gestionan los scripts SQL, no TypeORM.
  logging: config.get('DB_LOGGING', { infer: true }) === 'true',
});
