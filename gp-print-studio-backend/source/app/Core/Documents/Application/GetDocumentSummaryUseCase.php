<?php

declare(strict_types=1);

namespace App\Core\Documents\Application;

use App\Core\Documents\Domain\Repositories\DocumentRepositoryInterface;

class GetDocumentSummaryUseCase
{
    private DocumentRepositoryInterface $repository;

    public function __construct(DocumentRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Orquesta la obtención del listado de documentos resumido.
     */
    public function execute(int $page = 1, int $perPage = 10, ?string $search = null): array
    {
        // Validaciones de negocio preventivas (opcional)
        if ($page < 1) {
            $page = 1;
        }
        
        if ($perPage < 1 || $perPage > 100) {
            $perPage = 10;
        }

        return $this->repository->getPaginatedSummary($page, $perPage, $search);
    }
}
