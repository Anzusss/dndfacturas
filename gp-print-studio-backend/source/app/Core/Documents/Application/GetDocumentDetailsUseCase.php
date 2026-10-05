<?php

declare(strict_types=1);

namespace App\Core\Documents\Application;

use App\Core\Documents\Domain\Repositories\DocumentRepositoryInterface;

class GetDocumentDetailsUseCase
{
    private DocumentRepositoryInterface $repository;

    public function __construct(DocumentRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Orquesta la obtención del detalle de un documento.
     * Lanza una excepción si el documento no existe.
     */
    public function execute(string $documentNumber): array
    {
        if (empty(trim($documentNumber))) {
            throw new \InvalidArgumentException('El número de documento es requerido.');
        }

        $document = $this->repository->getDocumentDetails($documentNumber);

        if (!$document) {
            throw new \Exception("Documento no encontrado o no válido: {$documentNumber}", 404);
        }

        return $document;
    }
}
