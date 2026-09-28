/**
 * @file Validación de variables de entorno al arrancar.
 *
 * Si falta o es inválida una variable obligatoria, la aplicación no arranca y
 * muestra qué está mal (mejor que fallar más tarde con un error confuso).
 * Los valores por defecto sirven para desarrollo con el docker-compose del proyecto.
 */

import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

/** Variables admitidas (ver backend/.env.example). */
export class EnvironmentVariables {
  /** Puerto HTTP del backend. */
  @IsInt() @Min(1) @Max(65535)
  PORT: number = 3000;

  /** Orígenes permitidos por CORS, separados por comas (el frontend de Vite). */
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:5173,http://localhost:5174';

  // ── Base de datos (mismas credenciales que docker-compose.yml) ──
  @IsString()
  DB_HOST: string = 'localhost';

  @IsInt() @Min(1) @Max(65535)
  DB_PORT: number = 5432;

  @IsString()
  DB_NAME: string = 'dndfacturas';

  @IsString()
  DB_USER: string = 'dndfacturas';

  @IsString()
  DB_PASSWORD: string = 'dndfacturas_dev';

  /** Muestra en consola las consultas SQL (útil para depurar). */
  @IsOptional() @IsString()
  DB_LOGGING?: string;

  // ── API de facturas de Dynamics ──
  /**
   * URL de la API de facturas; `{numero}` se sustituye por el nº de factura.
   * Por defecto apunta a la API simulada (`npm run mock-api` en la raíz).
   */
  @IsString()
  DYNAMICS_API_URL: string = 'http://localhost:3001/facturas/{numero}';

  /** Token/clave de la API de Dynamics. Se queda en el servidor (nunca llega al navegador). */
  @IsOptional() @IsString()
  DYNAMICS_API_TOKEN?: string;

  /** Tiempo máximo de espera de la API de Dynamics (ms). */
  @IsInt() @Min(1000)
  DYNAMICS_API_TIMEOUT_MS: number = 10000;
}

/**
 * Función `validate` para ConfigModule: convierte tipos (p. ej. "5432" → 5432)
 * y lanza un error legible si algo no es válido.
 */
export const validateEnv = (config: Record<string, unknown>): EnvironmentVariables => {
  const validated = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors.map((e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`);
    throw new Error(`Variables de entorno inválidas:\n  - ${details.join('\n  - ')}`);
  }
  return validated;
};
