/**
 * @file Tests unitarios de las reglas de dominio (sin base de datos ni HTTP).
 */

import { getPeriodStart } from './audit-period.js';
import { hasPermission, isRole, PERMISSIONS, ROLES } from './permissions.js';
import { getTransitionError, TEMPLATE_STATUS } from './template-lifecycle.js';
import { EXPORT_FORMAT, parseImportPayload, validateElements } from './template-validation.js';

const validElement = { id: 'b1', type: 'grid', x: 0, y: 0, width: 100, height: 50 };

describe('Ciclo de vida de plantillas', () => {
  it('permite BORRADOR → EN_REVISION → APROBADA', () => {
    expect(getTransitionError(TEMPLATE_STATUS.DRAFT, TEMPLATE_STATUS.IN_REVIEW)).toBeNull();
    expect(getTransitionError(TEMPLATE_STATUS.IN_REVIEW, TEMPLATE_STATUS.APPROVED)).toBeNull();
  });

  it('permite rechazar (EN_REVISION → BORRADOR)', () => {
    expect(getTransitionError(TEMPLATE_STATUS.IN_REVIEW, TEMPLATE_STATUS.DRAFT)).toBeNull();
  });

  it('no permite saltarse la revisión ni salir de APROBADA', () => {
    expect(getTransitionError(TEMPLATE_STATUS.DRAFT, TEMPLATE_STATUS.APPROVED)).toMatch(/No se puede pasar/);
    expect(getTransitionError(TEMPLATE_STATUS.APPROVED, TEMPLATE_STATUS.DRAFT)).toMatch(/No se puede pasar/);
  });
});

describe('Permisos', () => {
  it('el diseñador edita pero no aprueba ni activa', () => {
    expect(hasPermission(ROLES.DESIGNER, PERMISSIONS.EDIT_TEMPLATES)).toBe(true);
    expect(hasPermission(ROLES.DESIGNER, PERMISSIONS.REVIEW_TEMPLATES)).toBe(false);
    expect(hasPermission(ROLES.DESIGNER, PERMISSIONS.ACTIVATE_TEMPLATES)).toBe(false);
  });

  it('la gerente tiene todos los permisos', () => {
    Object.values(PERMISSIONS).forEach((permission) => expect(hasPermission(ROLES.MANAGER, permission)).toBe(true));
  });

  it('sin rol no hay permisos y los roles desconocidos se rechazan', () => {
    expect(hasPermission(undefined, PERMISSIONS.PRINT_INVOICES)).toBe(false);
    expect(isRole('ADMIN')).toBe(false);
  });
});

describe('Validación de bloques', () => {
  it('acepta bloques válidos', () => {
    expect(validateElements([validElement])).toEqual([]);
  });

  it('detecta tipo desconocido, id ausente y geometría inválida', () => {
    const errors = validateElements([{ type: 'hack', x: 'a' }]);
    expect(errors).toHaveLength(3);
  });

  it('exige una lista', () => {
    expect(validateElements('nada')).toEqual(['La plantilla no tiene lista de bloques (elements).']);
  });
});

describe('Importación', () => {
  const template = { name: 'X', pageSetup: { size: 'LETTER' }, elements: [validElement] };

  it('acepta el formato de exportación, { template } y la plantilla suelta', () => {
    expect(parseImportPayload({ format: EXPORT_FORMAT, schemaVersion: 1, template }).name).toBe('X');
    expect(parseImportPayload({ template }).name).toBe('X');
    expect(parseImportPayload(template).name).toBe('X');
  });

  it('rechaza archivos de una versión más nueva', () => {
    expect(() => parseImportPayload({ format: EXPORT_FORMAT, schemaVersion: 99, template })).toThrow(/más nueva/);
  });

  it('rechaza plantillas sin pageSetup', () => {
    expect(() => parseImportPayload({ elements: [] })).toThrow(/pageSetup/);
  });
});

describe('Periodos de auditoría', () => {
  // Domingo 27/09/2026 15:30 (hora local).
  const sunday = new Date(2026, 8, 27, 15, 30);

  it('"all" no tiene límite', () => {
    expect(getPeriodStart('all', sunday)).toBeNull();
  });

  it('"today" empieza a medianoche', () => {
    expect(getPeriodStart('today', sunday)).toEqual(new Date(2026, 8, 27));
  });

  it('"week" empieza el lunes (aunque hoy sea domingo)', () => {
    expect(getPeriodStart('week', sunday)).toEqual(new Date(2026, 8, 21));
  });

  it('"month" empieza el día 1', () => {
    expect(getPeriodStart('month', sunday)).toEqual(new Date(2026, 8, 1));
  });
});
