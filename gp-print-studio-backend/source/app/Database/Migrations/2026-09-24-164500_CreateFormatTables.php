<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateFormatTables extends Migration
{
    public function up()
    {
        // Al tratarse de PostgreSQL y querer usar funciones nativas como gen_random_uuid() y JSONB,
        // ejecutamos las instrucciones DDL puras en lugar de usar el Forge genérico de CI4.
        
        $this->db->query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

        $this->db->query("
            CREATE TABLE document_formats (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                description TEXT,
                document_type_id INT NOT NULL,
                active_version_id UUID,
                created_by_id UUID,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP WITH TIME ZONE
            )
        ");

        $this->db->query("CREATE INDEX idx_document_formats_type ON document_formats(document_type_id)");
        $this->db->query("CREATE INDEX idx_document_formats_deleted ON document_formats(deleted_at) WHERE deleted_at IS NULL");

        $this->db->query("
            CREATE TABLE document_format_versions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                format_id UUID NOT NULL,
                version_number INT NOT NULL,
                layout_json JSONB NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
                created_by_id UUID,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                
                CONSTRAINT fk_version_format 
                    FOREIGN KEY(format_id) 
                    REFERENCES document_formats(id) 
                    ON DELETE CASCADE,
                    
                CONSTRAINT uq_format_version 
                    UNIQUE (format_id, version_number)
            )
        ");

        $this->db->query("CREATE INDEX idx_document_format_versions_status ON document_format_versions(status)");

        // Foreign Key circular
        $this->db->query("
            ALTER TABLE document_formats 
            ADD CONSTRAINT fk_active_version 
            FOREIGN KEY (active_version_id) 
            REFERENCES document_format_versions(id) 
            ON DELETE SET NULL
        ");
    }

    public function down()
    {
        // El Forge sí es bueno para borrar tablas rápidamente (elimina las constraints solas)
        $this->forge->dropTable('document_format_versions', true);
        $this->forge->dropTable('document_formats', true);
    }
}
