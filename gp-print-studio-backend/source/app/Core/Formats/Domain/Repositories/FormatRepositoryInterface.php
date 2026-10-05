<?php

declare(strict_types=1);

namespace App\Core\Formats\Domain\Repositories;

interface FormatRepositoryInterface
{
    /**
     * Lista todos los formatos maestros que no han sido borrados.
     */
    public function findAll(): array;

    /**
     * Obtiene la cabecera de un formato específico.
     */
    public function findById(string $formatId): ?array;

    /**
     * Crea la cabecera de un formato y retorna el UUID generado.
     */
    public function create(array $data): string;

    /**
     * Crea una nueva iteración/versión para un formato y retorna su UUID.
     * $data incluye: format_id, version_number, layout_json, status.
     */
    public function createVersion(array $data): string;

    /**
     * Obtiene el número de la última versión creada para un formato.
     */
    public function getLastVersionNumber(string $formatId): int;

    /**
     * Actualiza el active_version_id de un formato maestro.
     */
    public function setActiveVersion(string $formatId, string $versionId): void;

    /**
     * Archiva (desactiva) todas las versiones previas de un formato.
     */
    public function archivePreviousVersions(string $formatId, string $excludeVersionId): void;

    /**
     * Obtiene la versión activa (layout_json) de un formato.
     */
    public function getActiveVersion(string $formatId): ?array;

    /**
     * Obtiene el historial de versiones de un formato.
     */
    public function getVersionsHistory(string $formatId): array;
}
