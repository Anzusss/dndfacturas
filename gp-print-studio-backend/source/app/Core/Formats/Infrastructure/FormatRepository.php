<?php

declare(strict_types=1);

namespace App\Core\Formats\Infrastructure;

use App\Core\Formats\Domain\Repositories\FormatRepositoryInterface;
use Config\Database;

class FormatRepository implements FormatRepositoryInterface
{
    public function findAll(): array
    {
        $db = Database::connect(); // Usa la base local por defecto (PostgreSQL/MySQL)
        $builder = $db->table('document_formats');
        $builder->select('id, name, description, document_type_id, active_version_id, created_at, updated_at');
        $builder->where('deleted_at', null);
        $builder->orderBy('created_at', 'DESC');
        
        return $builder->get()->getResultArray();
    }

    public function findById(string $formatId): ?array
    {
        $db = Database::connect();
        $builder = $db->table('document_formats');
        $builder->select('id, name, description, document_type_id, active_version_id, created_at');
        $builder->where('id', $formatId);
        $builder->where('deleted_at', null);
        
        return $builder->get()->getRowArray();
    }

    public function create(array $data): string
    {
        $db = Database::connect();
        
        $sql = "INSERT INTO document_formats (name, description, document_type_id) 
                VALUES (?, ?, ?) RETURNING id";
        $query = $db->query($sql, [
            $data['name'], 
            $data['description'] ?? null, 
            $data['document_type_id']
        ]);
        
        $result = $query->getRow();
        return $result->id;
    }

    public function createVersion(array $data): string
    {
        $db = Database::connect();
        
        // Convertimos el array a string JSON para JSONB
        $layoutJson = json_encode($data['layout_json']);
        
        $sql = "INSERT INTO document_format_versions (format_id, version_number, layout_json, status) 
                VALUES (?, ?, ?::jsonb, ?) RETURNING id";
        $query = $db->query($sql, [
            $data['format_id'],
            $data['version_number'],
            $layoutJson,
            $data['status']
        ]);
        
        $result = $query->getRow();
        return $result->id;
    }

    public function getLastVersionNumber(string $formatId): int
    {
        $db = Database::connect();
        $builder = $db->table('document_format_versions');
        $builder->selectMax('version_number');
        $builder->where('format_id', $formatId);
        
        $row = $builder->get()->getRowArray();
        return (int) ($row['version_number'] ?? 0);
    }

    public function setActiveVersion(string $formatId, string $versionId): void
    {
        $db = Database::connect();
        $builder = $db->table('document_formats');
        $builder->where('id', $formatId);
        $builder->update([
            'active_version_id' => $versionId,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    public function archivePreviousVersions(string $formatId, string $excludeVersionId): void
    {
        $db = Database::connect();
        $builder = $db->table('document_format_versions');
        $builder->where('format_id', $formatId);
        $builder->where('id !=', $excludeVersionId);
        $builder->update(['status' => 'ARCHIVED']);
    }

    public function getActiveVersion(string $formatId): ?array
    {
        $db = Database::connect();
        
        $sql = "SELECT v.id, v.version_number, v.layout_json, v.status, v.created_at
                FROM document_formats f
                INNER JOIN document_format_versions v ON f.active_version_id = v.id
                WHERE f.id = ? AND f.deleted_at IS NULL";
                
        $query = $db->query($sql, [$formatId]);
        $row = $query->getRowArray();
        
        if ($row && isset($row['layout_json'])) {
            // Decodificamos el JSONB de la BD a Array PHP
            $row['layout_json'] = json_decode($row['layout_json'], true);
        }
        
        return $row;
    }

    public function getVersionsHistory(string $formatId): array
    {
        $db = Database::connect();
        $builder = $db->table('document_format_versions');
        // Agregamos layout_json para traer todos los detalles de Canvas en el historial
        $builder->select('id, version_number, layout_json, status, created_at');
        $builder->where('format_id', $formatId);
        $builder->orderBy('version_number', 'DESC');
        
        $versions = $builder->get()->getResultArray();

        // Decodificamos el JSONB a array PHP para cada versión
        foreach ($versions as &$version) {
            if (!empty($version['layout_json'])) {
                $version['layout_json'] = json_decode($version['layout_json'], true);
            }
        }

        return $versions;
    }
}
