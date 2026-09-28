-- =============================================================================
-- dndFacturas · Esquema de base de datos (PostgreSQL 16)
--
-- Docker ejecuta este archivo automáticamente la PRIMERA vez que crea el
-- volumen de datos (carpeta /docker-entrypoint-initdb.d). Para volver a
-- ejecutarlo desde cero:  docker compose down -v && docker compose up -d
--
-- Refleja el modelo del frontend (src/domain):
--   invoice_types      Tipos de factura (Crédito, Contado…).
--   invoice_templates  Plantillas; cada fila es UNA VERSIÓN (template_id + version).
--   active_templates   Plantilla activa por tipo de factura (una como máximo).
--   template_history   Historial de cambios de plantillas (solo inserción).
--   print_logs         Auditoría de impresiones (solo inserción).
--
-- Las reglas críticas también se aplican aquí (triggers), no solo en la app:
-- una versión aprobada no se modifica, solo se activan versiones aprobadas
-- del mismo tipo, y la auditoría no se puede editar ni borrar.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Función común: mantiene `updated_at` al día en cada UPDATE.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Función común: impide modificar o borrar registros de auditoría.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION forbid_audit_changes() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'La tabla % es de solo inserción (auditoría): no se permite %.', TG_TABLE_NAME, TG_OP;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- invoice_types: catálogo de tipos de factura
-- =============================================================================
CREATE TABLE invoice_types (
  code              VARCHAR(20)  PRIMARY KEY,               -- 'CREDITO', 'CONTADO'
  label             VARCHAR(50)  NOT NULL,                  -- Nombre legible
  dynamics_aliases  TEXT[]       NOT NULL DEFAULT '{}',     -- Códigos equivalentes en Dynamics
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE invoice_types IS 'Tipos de factura. Cada uno tiene como máximo una plantilla activa.';
COMMENT ON COLUMN invoice_types.dynamics_aliases IS 'Valores con los que la API de Dynamics identifica el tipo (ver INVOICE_TYPE_ALIASES en el frontend).';


-- =============================================================================
-- invoice_templates: versiones de plantillas
-- =============================================================================
CREATE TABLE invoice_templates (
  template_id     VARCHAR(100) NOT NULL,
  version         INTEGER      NOT NULL CHECK (version > 0),
  name            VARCHAR(200) NOT NULL,
  invoice_type    VARCHAR(20)  NOT NULL REFERENCES invoice_types (code),
  status          VARCHAR(20)  NOT NULL DEFAULT 'BORRADOR'
                    CHECK (status IN ('BORRADOR', 'EN_REVISION', 'APROBADA')),
  schema_version  INTEGER      NOT NULL DEFAULT 1,          -- Formato del JSON (TEMPLATE_SCHEMA_VERSION)

  -- Diseño: mismo formato que usa el frontend.
  page_setup      JSONB        NOT NULL,                    -- Tamaño de hoja, márgenes, fuente
  elements        JSONB        NOT NULL DEFAULT '[]'::jsonb,-- Bloques del lienzo

  -- Columnas calculadas para filtrar sin abrir el JSON.
  paper_size      VARCHAR(20)  GENERATED ALWAYS AS (page_setup ->> 'size') STORED,
  paper_orientation VARCHAR(20) GENERATED ALWAYS AS (page_setup ->> 'orientation') STORED,

  review_comment  TEXT,                                     -- Motivo del último rechazo
  created_by      VARCHAR(150) NOT NULL,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by      VARCHAR(150) NOT NULL,
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  approved_by     VARCHAR(150),
  approved_at     TIMESTAMPTZ,

  PRIMARY KEY (template_id, version),
  CONSTRAINT elements_is_array   CHECK (jsonb_typeof(elements) = 'array'),
  CONSTRAINT page_setup_is_object CHECK (jsonb_typeof(page_setup) = 'object'),
  CONSTRAINT approved_has_approver CHECK (
    status <> 'APROBADA' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)
  )
);

CREATE INDEX idx_invoice_templates_type_status ON invoice_templates (invoice_type, status);

COMMENT ON TABLE invoice_templates IS 'Cada fila es una versión de una plantilla. Las versiones aprobadas son inmutables.';

CREATE TRIGGER trg_invoice_templates_updated_at
  BEFORE UPDATE ON invoice_templates
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- Reglas del ciclo de vida (equivalente a src/domain/models/templateLifecycle.js):
--   BORRADOR → EN_REVISION → APROBADA   (EN_REVISION → BORRADOR al rechazar)
--   Solo los borradores pueden cambiar su diseño; una aprobada no cambia nunca.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_template_lifecycle() RETURNS trigger AS $$
DECLARE
  design_changed BOOLEAN;
BEGIN
  design_changed :=
       NEW.page_setup   IS DISTINCT FROM OLD.page_setup
    OR NEW.elements     IS DISTINCT FROM OLD.elements
    OR NEW.name         IS DISTINCT FROM OLD.name
    OR NEW.invoice_type IS DISTINCT FROM OLD.invoice_type;

  IF NEW.template_id <> OLD.template_id OR NEW.version <> OLD.version THEN
    RAISE EXCEPTION 'No se puede cambiar la identidad (template_id/version) de una plantilla.';
  END IF;

  IF design_changed AND OLD.status <> 'BORRADOR' THEN
    RAISE EXCEPTION 'La versión % de "%" está en estado % y no se puede modificar. Crea una nueva versión.',
      OLD.version, OLD.template_id, OLD.status;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status AND NOT (
       (OLD.status = 'BORRADOR'    AND NEW.status = 'EN_REVISION')
    OR (OLD.status = 'EN_REVISION' AND NEW.status IN ('APROBADA', 'BORRADOR'))
  ) THEN
    RAISE EXCEPTION 'Transición de estado no permitida: % → %.', OLD.status, NEW.status;
  END IF;

  -- Mensaje legible; el CHECK approved_has_approver queda como respaldo.
  IF NEW.status = 'APROBADA' AND (NEW.approved_by IS NULL OR NEW.approved_at IS NULL) THEN
    RAISE EXCEPTION 'Para aprobar una plantilla hay que indicar quién la aprueba (approved_by) y cuándo (approved_at).';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_templates_lifecycle
  BEFORE UPDATE ON invoice_templates
  FOR EACH ROW EXECUTE FUNCTION enforce_template_lifecycle();

-- Solo se pueden borrar borradores (las aprobadas son historial fiscal).
CREATE OR REPLACE FUNCTION forbid_non_draft_delete() RETURNS trigger AS $$
BEGIN
  IF OLD.status <> 'BORRADOR' THEN
    RAISE EXCEPTION 'Solo se pueden eliminar borradores (la versión % de "%" está %).',
      OLD.version, OLD.template_id, OLD.status;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_templates_delete
  BEFORE DELETE ON invoice_templates
  FOR EACH ROW EXECUTE FUNCTION forbid_non_draft_delete();


-- =============================================================================
-- active_templates: plantilla activa por tipo de factura
-- La clave primaria (invoice_type) garantiza una sola activa por tipo.
-- =============================================================================
CREATE TABLE active_templates (
  invoice_type      VARCHAR(20)  PRIMARY KEY REFERENCES invoice_types (code),
  template_id       VARCHAR(100) NOT NULL,
  template_version  INTEGER      NOT NULL,
  activated_by      VARCHAR(150) NOT NULL,
  activated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  FOREIGN KEY (template_id, template_version)
    REFERENCES invoice_templates (template_id, version) ON DELETE RESTRICT
);

COMMENT ON TABLE active_templates IS 'Qué versión se usa para imprimir cada tipo de factura.';

-- Solo se activan versiones APROBADAS del MISMO tipo de factura.
CREATE OR REPLACE FUNCTION enforce_active_template() RETURNS trigger AS $$
DECLARE
  tpl RECORD;
BEGIN
  SELECT status, invoice_type INTO tpl
    FROM invoice_templates
   WHERE template_id = NEW.template_id AND version = NEW.template_version;

  IF tpl.status <> 'APROBADA' THEN
    RAISE EXCEPTION 'Solo se pueden activar plantillas aprobadas (estado actual: %).', tpl.status;
  END IF;
  IF tpl.invoice_type <> NEW.invoice_type THEN
    RAISE EXCEPTION 'La plantilla es de tipo % y no puede activarse para %.', tpl.invoice_type, NEW.invoice_type;
  END IF;

  NEW.activated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_active_templates_check
  BEFORE INSERT OR UPDATE ON active_templates
  FOR EACH ROW EXECUTE FUNCTION enforce_active_template();


-- =============================================================================
-- template_history: historial de cambios (auditoría, solo inserción)
-- Sin clave foránea a propósito: el historial se conserva aunque se borre un borrador.
-- =============================================================================
CREATE TABLE template_history (
  id               BIGSERIAL    PRIMARY KEY,
  template_id      VARCHAR(100) NOT NULL,
  version          INTEGER      NOT NULL,
  template_name    VARCHAR(200) NOT NULL,
  invoice_type     VARCHAR(20)  REFERENCES invoice_types (code),
  action           VARCHAR(30)  NOT NULL CHECK (action IN (
                     'CREADA', 'GUARDADA', 'NUEVA_VERSION', 'ENVIADA_REVISION',
                     'APROBADA', 'RECHAZADA', 'ACTIVADA', 'IMPORTADA', 'EXPORTADA')),
  user_email       VARCHAR(150) NOT NULL,
  comment          TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_template_history_template ON template_history (template_id, version);
CREATE INDEX idx_template_history_created_at ON template_history (created_at DESC);

COMMENT ON TABLE template_history IS 'Quién creó, editó, aprobó o activó cada versión. Solo inserción.';

CREATE TRIGGER trg_template_history_append_only
  BEFORE UPDATE OR DELETE ON template_history
  FOR EACH ROW EXECUTE FUNCTION forbid_audit_changes();


-- =============================================================================
-- print_logs: auditoría de impresiones (solo inserción)
-- Sin clave foránea a invoice_templates: las impresiones de PRUEBA pueden
-- hacerse con borradores aún no guardados.
-- =============================================================================
CREATE TABLE print_logs (
  id                BIGSERIAL    PRIMARY KEY,
  invoice_id        VARCHAR(100) NOT NULL,                  -- Nº de factura (o PRUEBA-DISEÑO)
  invoice_type      VARCHAR(20)  REFERENCES invoice_types (code),
  template_id       VARCHAR(100) NOT NULL,
  template_version  INTEGER,
  printed_by        VARCHAR(150) NOT NULL,
  copies            SMALLINT     NOT NULL DEFAULT 1 CHECK (copies > 0),
  status            VARCHAR(10)  NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'TEST')),
  invoice_snapshot  JSONB,                                  -- Datos impresos (opcional, para trazabilidad)
  printed_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_print_logs_invoice ON print_logs (invoice_id);
CREATE INDEX idx_print_logs_printed_at ON print_logs (printed_at DESC);

COMMENT ON TABLE print_logs IS 'Cada impresión con la plantilla y versión usadas. Solo inserción.';

CREATE TRIGGER trg_print_logs_append_only
  BEFORE UPDATE OR DELETE ON print_logs
  FOR EACH ROW EXECUTE FUNCTION forbid_audit_changes();


-- =============================================================================
-- Vistas de apoyo para consultas y reportes
-- =============================================================================

-- Plantilla activa de cada tipo con sus datos principales.
CREATE VIEW v_active_templates AS
SELECT it.code          AS invoice_type,
       it.label         AS invoice_type_label,
       t.template_id,
       t.version,
       t.name,
       t.paper_size,
       t.paper_orientation,
       a.activated_by,
       a.activated_at
  FROM invoice_types it
  LEFT JOIN active_templates a ON a.invoice_type = it.code
  LEFT JOIN invoice_templates t ON t.template_id = a.template_id AND t.version = a.template_version;

-- Impresiones reales por factura (para detectar reimpresiones).
CREATE VIEW v_invoice_print_counts AS
SELECT invoice_id,
       count(*)        AS times_printed,
       min(printed_at) AS first_printed_at,
       max(printed_at) AS last_printed_at
  FROM print_logs
 WHERE status = 'SUCCESS'
 GROUP BY invoice_id;

-- Última versión de cada plantilla (equivale a getLatestVersions en el frontend).
CREATE VIEW v_latest_templates AS
SELECT DISTINCT ON (template_id) *
  FROM invoice_templates
 ORDER BY template_id, version DESC;

COMMIT;
