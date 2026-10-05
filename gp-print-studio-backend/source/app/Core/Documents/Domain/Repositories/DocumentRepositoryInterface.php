<?php

declare(strict_types=1);

namespace App\Core\Documents\Domain\Repositories;

interface DocumentRepositoryInterface
{
    /**
     * Obtiene el listado resumido de documentos con paginación
     */
    public function getPaginatedSummary(int $page, int $perPage, ?string $search = null): array;

    /**
     * Obtiene todo el detalle completo (cabecera y líneas) de un documento específico
     */
    public function getDocumentDetails(string $documentNumber): ?array;
}
