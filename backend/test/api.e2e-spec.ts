/**
 * @file Tests e2e de la API: peticiones HTTP reales contra la base de datos
 * de pruebas. Cubre el flujo completo de una plantilla (borrador → revisión →
 * aprobación → activación), permisos, reglas, auditoría y el proxy a Dynamics.
 *
 * Antes de empezar se vacía `dndfacturas_test` y se vuelven a cargar los datos
 * iniciales (database/init/02_seed.sql).
 */

import { readFile } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

const DESIGNER = { 'X-User-Email': 'disenador@empresa.com', 'X-User-Role': 'DISENADOR' };
const MANAGER = { 'X-User-Email': 'gerente.tesoreria@empresa.com', 'X-User-Role': 'GERENTE' };
const TEMPLATE_ID = 'factura-fiscal-real-v1';
const SEED_FILE = new URL('../../database/init/02_seed.sql', import.meta.url);

/** "Dynamics" falso: solo conoce una factura. */
const FAKE_INVOICE = { facturaNo: 'SERIE H 0000255', tipoFactura: 'CREDITO', cliente: 'LA CASA DEL GRANJERO C.A' };

describe('dndFacturas API (e2e)', () => {
  let app: INestApplication<App>;
  let fakeDynamics: Server;
  let http: ReturnType<typeof request<App>>;

  beforeAll(async () => {
    fakeDynamics = createServer((req, res) => {
      const found = decodeURIComponent(req.url ?? '').endsWith(FAKE_INVOICE.facturaNo);
      res.writeHead(found ? 200 : 404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(found ? FAKE_INVOICE : { error: 'no encontrada' }));
    }).listen(3999);

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    // Servidor escuchando durante todo el test (puerto libre al azar). Si no,
    // supertest lo abre y cierra en cada petición y las peticiones anidadas fallan.
    await app.listen(0);
    http = request(app.getHttpServer());

    // Base de datos de pruebas limpia (TRUNCATE no dispara los triggers de solo inserción).
    const dataSource = app.get(DataSource);
    expect(dataSource.options.database).toBe('dndfacturas_test'); // Nunca contra desarrollo.
    await dataSource.query(
      'TRUNCATE print_logs, template_history, active_templates, invoice_templates, invoice_types RESTART IDENTITY CASCADE',
    );
    await dataSource.query(await readFile(SEED_FILE, 'utf8'));
  });

  afterAll(async () => {
    await app?.close();
    fakeDynamics?.close();
  });

  /** Contenido de un borrador a partir de la v1 sembrada. */
  const draftBody = async () => {
    const { body } = await http.get(`/api/templates/${TEMPLATE_ID}/versions/1`).expect(200);
    return {
      ...body,
      name: 'Crédito media carta',
      pageSetup: { ...body.pageSetup, size: 'HALF_LETTER', orientation: 'landscape' },
      status: 'APROBADA', // Debe ignorarse (whitelist del ValidationPipe).
      approvedBy: 'intruso@empresa.com',
    };
  };

  describe('Lecturas', () => {
    it('GET /api/health', () => http.get('/api/health').expect(200).expect(({ body }) => expect(body.database).toBe('ok')));

    it('GET /api/invoice-types devuelve Crédito y Contado', async () => {
      const { body } = await http.get('/api/invoice-types').expect(200);
      expect(body.map((t: { code: string }) => t.code)).toEqual(['CONTADO', 'CREDITO']);
    });

    it('GET /api/active-templates tiene una activa por tipo', async () => {
      const { body } = await http.get('/api/active-templates').expect(200);
      expect(body.CREDITO).toMatchObject({ templateId: TEMPLATE_ID, version: 1 });
      expect(body.CONTADO).toMatchObject({ templateId: 'factura-contado-v1', version: 1 });
    });
  });

  describe('Flujo de una nueva versión', () => {
    it('exige usuario (401) para guardar', async () => {
      await http.put(`/api/templates/${TEMPLATE_ID}/versions/2`).send(await draftBody()).expect(401);
    });

    it('guarda la v2 como borrador ignorando status/approvedBy enviados', async () => {
      const { body } = await http
        .put(`/api/templates/${TEMPLATE_ID}/versions/2`)
        .set(DESIGNER)
        .send(await draftBody())
        .expect(200);
      expect(body).toMatchObject({ version: 2, status: 'BORRADOR', approvedBy: null, name: 'Crédito media carta' });
      expect(body.pageSetup.size).toBe('HALF_LETTER');
    });

    it('no permite modificar la v1 aprobada (409)', async () => {
      await http.put(`/api/templates/${TEMPLATE_ID}/versions/1`).set(DESIGNER).send(await draftBody()).expect(409);
    });

    it('rechaza bloques inválidos (400)', async () => {
      await http
        .put(`/api/templates/${TEMPLATE_ID}/versions/2`)
        .set(DESIGNER)
        .send({ name: 'x', invoiceType: 'CREDITO', pageSetup: {}, elements: [{ type: 'hack' }] })
        .expect(400);
    });

    it('no permite activar un borrador (409)', async () => {
      await http.put('/api/active-templates/CREDITO').set(MANAGER).send({ templateId: TEMPLATE_ID, version: 2 }).expect(409);
    });

    it('envía a revisión; el diseñador no puede aprobar (403)', async () => {
      await http.post(`/api/templates/${TEMPLATE_ID}/versions/2/submit`).set(DESIGNER).expect(200);
      await http.post(`/api/templates/${TEMPLATE_ID}/versions/2/approve`).set(DESIGNER).expect(403);
    });

    it('la gerente rechaza con motivo y vuelve a borrador', async () => {
      const { body } = await http
        .post(`/api/templates/${TEMPLATE_ID}/versions/2/reject`)
        .set(MANAGER)
        .send({ comment: 'Ajustar margen' })
        .expect(200);
      expect(body).toMatchObject({ status: 'BORRADOR', reviewComment: 'Ajustar margen' });
    });

    it('reenvía, la gerente aprueba y la activa para Crédito', async () => {
      await http.post(`/api/templates/${TEMPLATE_ID}/versions/2/submit`).set(DESIGNER).expect(200);
      const approved = await http.post(`/api/templates/${TEMPLATE_ID}/versions/2/approve`).set(MANAGER).expect(200);
      expect(approved.body).toMatchObject({ status: 'APROBADA', approvedBy: MANAGER['X-User-Email'] });

      await http.put('/api/active-templates/CONTADO').set(MANAGER).send({ templateId: TEMPLATE_ID, version: 2 }).expect(409);
      await http.put('/api/active-templates/CREDITO').set(MANAGER).send({ templateId: TEMPLATE_ID, version: 2 }).expect(200);

      const active = await http.get('/api/active-templates/CREDITO/template').expect(200);
      expect(active.body).toMatchObject({ version: 2, pageSetup: { size: 'HALF_LETTER' } });
    });

    it('el historial registra todo el flujo en orden', async () => {
      const { body } = await http.get('/api/template-history?search=factura-fiscal-real-v1&limit=10').expect(200);
      expect(body.slice(0, 6).map((h: { action: string }) => h.action)).toEqual([
        'ACTIVADA',
        'APROBADA',
        'ENVIADA_REVISION',
        'RECHAZADA',
        'ENVIADA_REVISION',
        'NUEVA_VERSION',
      ]);
    });
  });

  describe('Importar / exportar', () => {
    it('exporta y reimporta como copia en borrador (el id ya existe)', async () => {
      const exported = await http.post(`/api/templates/${TEMPLATE_ID}/versions/2/export`).set(DESIGNER).expect(200);
      expect(exported.body.format).toBe('dndfacturas-template');

      const imported = await http.post('/api/templates/import').set(DESIGNER).send(exported.body).expect(201);
      expect(imported.body).toMatchObject({ version: 1, status: 'BORRADOR' });
      expect(imported.body.templateId).not.toBe(TEMPLATE_ID);
      expect(imported.body.name).toContain('(importada)');
    });

    it('rechaza archivos inválidos (400)', async () => {
      await http.post('/api/templates/import').set(DESIGNER).send({ template: { pageSetup: {} } }).expect(400);
    });
  });

  describe('Auditoría de impresiones', () => {
    it('registra impresiones a nombre del usuario de la sesión y las cuenta', async () => {
      const printed = await http
        .post('/api/print-logs')
        .set(MANAGER)
        .send({ invoiceId: 'SERIE H 0000255', invoiceType: 'CREDITO', templateId: TEMPLATE_ID, templateVersion: 2 })
        .expect(201);
      expect(printed.body.user).toBe(MANAGER['X-User-Email']);

      const { body } = await http.get('/api/print-logs/count').query({ invoiceId: 'SERIE H 0000255' }).expect(200);
      expect(body.count).toBe(1);
    });

    it('valida el cuerpo (400)', async () => {
      await http.post('/api/print-logs').set(MANAGER).send({ invoiceId: '' }).expect(400);
    });
  });

  describe('Proxy a Dynamics', () => {
    it('devuelve el JSON de la factura', async () => {
      const { body } = await http.get('/api/invoices/SERIE%20H%200000255').set(DESIGNER).expect(200);
      expect(body).toEqual(FAKE_INVOICE);
    });

    it('404 si la factura no existe y 401 sin usuario', async () => {
      await http.get('/api/invoices/NO-EXISTE').set(DESIGNER).expect(404);
      await http.get('/api/invoices/SERIE%20H%200000255').expect(401);
    });
  });
});
