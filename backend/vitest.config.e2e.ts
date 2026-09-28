import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Tests e2e: levantan la API completa contra la base de datos de PRUEBAS
 * (`dndfacturas_test`, creada por database/init/03_test_database.sh), nunca
 * contra la de desarrollo.
 *
 * Requisito: `docker compose up -d` en la raíz del proyecto.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Los tests comparten la misma base de datos: se ejecutan de uno en uno.
    fileParallelism: false,
    env: {
      DB_NAME: 'dndfacturas_test',
      // "Dynamics" falso que levanta el propio test.
      DYNAMICS_API_URL: 'http://localhost:3999/facturas/{numero}',
      DYNAMICS_API_TIMEOUT_MS: '3000',
    },
  },
});
