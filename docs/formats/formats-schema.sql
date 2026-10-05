-- ==============================================================================
-- Módulo: Gestor de Formatos de Impresión
-- Descripción: Script DDL (PostgreSQL) para la creación física de las tablas.
-- ==============================================================================

-- 1. Extensión necesaria para UUIDs genéricos si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLA: document_formats
-- ==============================================================================
CREATE TABLE document_formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    document_type_id INT NOT NULL,
    active_version_id UUID, -- Será FK hacia document_format_versions, se añade constraint más abajo
    created_by_id UUID,     -- Opcional para auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices de búsqueda
CREATE INDEX idx_document_formats_type ON document_formats(document_type_id);
CREATE INDEX idx_document_formats_deleted ON document_formats(deleted_at) WHERE deleted_at IS NULL;

-- ==============================================================================
-- TABLA: document_format_versions
-- ==============================================================================
CREATE TABLE document_format_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    format_id UUID NOT NULL,
    version_number INT NOT NULL,
    layout_json JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
    created_by_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricciones y FKs
    CONSTRAINT fk_version_format 
        FOREIGN KEY(format_id) 
        REFERENCES document_formats(id) 
        ON DELETE CASCADE,
        
    -- Prevenir condiciones de carrera con la misma versión
    CONSTRAINT uq_format_version 
        UNIQUE (format_id, version_number)
);

-- Índices de búsqueda
CREATE INDEX idx_document_format_versions_status ON document_format_versions(status);

-- ==============================================================================
-- ALTER: Foreign Key Circular (Opcional, pero recomendada)
-- Se añade la restricción al maestro para apuntar a la versión activa válida.
-- ==============================================================================
ALTER TABLE document_formats 
ADD CONSTRAINT fk_active_version 
FOREIGN KEY (active_version_id) 
REFERENCES document_format_versions(id) 
ON DELETE SET NULL;
