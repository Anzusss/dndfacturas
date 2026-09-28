/**
 * @file Traduce errores de PostgreSQL a respuestas HTTP comprensibles.
 *
 * Los triggers de la base de datos lanzan mensajes en español (p. ej. "La
 * versión 1 … está APROBADA y no se puede modificar"). Sin este filtro
 * llegarían al cliente como un 500 genérico.
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/** Códigos de error de PostgreSQL → estado HTTP y mensaje por defecto. */
const PG_ERRORS: Record<string, { status: HttpStatus; message?: string }> = {
  P0001: { status: HttpStatus.CONFLICT },                                         // RAISE EXCEPTION (reglas de negocio)
  '23505': { status: HttpStatus.CONFLICT, message: 'Ya existe un registro con esa clave.' },
  '23503': { status: HttpStatus.CONFLICT, message: 'Referencia inválida o registro en uso.' },
  '23514': { status: HttpStatus.BAD_REQUEST, message: 'Los datos no cumplen las reglas de la base de datos.' },
  '22P02': { status: HttpStatus.BAD_REQUEST, message: 'Formato de dato inválido.' },
};

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const driverError = exception.driverError as { code?: string; message?: string } | undefined;
    const mapped = driverError?.code ? PG_ERRORS[driverError.code] : undefined;

    if (!mapped) {
      // Error inesperado: se registra completo y se responde sin detalles internos.
      this.logger.error(exception.message, exception.stack);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno de base de datos.',
      });
      return;
    }

    response.status(mapped.status).json({
      statusCode: mapped.status,
      message: mapped.message ?? driverError?.message ?? exception.message,
    });
  }
}
