/**
 * @file Módulo raíz: configuración, conexión a la base de datos, guard global
 * de autenticación y módulos de la aplicación.
 */

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv, type EnvironmentVariables } from './config/env.validation.js';
import { buildTypeOrmOptions } from './config/database.config.js';
import { MockAuthGuard } from './common/auth/mock-auth.guard.js';
import { InvoiceTypesModule } from './modules/invoice-types/invoice-types.module.js';
import { TemplatesModule } from './modules/templates/templates.module.js';
import { ActiveTemplatesModule } from './modules/active-templates/active-templates.module.js';
import { TemplateHistoryModule } from './modules/template-history/template-history.module.js';
import { PrintLogsModule } from './modules/print-logs/print-logs.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    // Variables de entorno: backend/.env (si existe) y validación al arrancar.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'], validate: validateEnv }),

    // Conexión a PostgreSQL (el esquema lo crean los scripts de database/init).
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => buildTypeOrmOptions(config),
    }),

    InvoiceTypesModule,
    TemplatesModule,
    ActiveTemplatesModule,
    TemplateHistoryModule,
    PrintLogsModule,
    InvoicesModule,
    HealthModule,
  ],
  providers: [
    // Guard global: identifica al usuario y aplica @RequirePermission en todos los endpoints.
    { provide: APP_GUARD, useClass: MockAuthGuard },
  ],
})
export class AppModule {}
