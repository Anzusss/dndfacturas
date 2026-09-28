/**
 * @file Tipo para columnas JSONB.
 *
 * Se usa `any` a propósito: TypeORM no acepta `Record<string, unknown>` en
 * inserciones/actualizaciones de columnas JSON. La estructura se valida
 * aparte (DTOs y `domain/template-validation.ts`).
 */
export type JsonObject = Record<string, any>;
