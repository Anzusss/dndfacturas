#!/bin/sh
# =============================================================================
# dndFacturas - Base de datos de PRUEBAS (dndfacturas_test)
#
# Se ejecuta automaticamente despues de 01_schema.sql y 02_seed.sql, solo al
# crear el volumen. Crea una segunda base de datos con el mismo esquema para
# los tests e2e del backend (npm run test:e2e), de modo que nunca ensucien
# la base de datos de desarrollo (la auditoria es de solo insercion).
# =============================================================================
set -e

TEST_DB="${POSTGRES_DB}_test"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"   -c "CREATE DATABASE \"$TEST_DB\""

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$TEST_DB"   -f /docker-entrypoint-initdb.d/01_schema.sql   -f /docker-entrypoint-initdb.d/02_seed.sql

echo "Base de datos de pruebas \"$TEST_DB\" creada."
