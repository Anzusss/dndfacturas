/**
 * @file Estado del servicio.
 *
 *   GET /api/health → { status: 'ok', database: 'ok' }
 *
 * Útil para comprobar rápidamente que el backend y la base de datos responden
 * (y para los "healthchecks" si el backend se despliega en Docker).
 */

import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Estado')
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Comprueba que el backend y la base de datos responden' })
  async check() {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({ status: 'error', database: 'sin conexión' });
    }
    return { status: 'ok', database: 'ok', timestamp: new Date().toISOString() };
  }
}
