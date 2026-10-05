<?php

declare(strict_types=1);

namespace App\Core\Formats\Application;

use App\Core\Formats\Domain\Repositories\FormatRepositoryInterface;

class CreateFormatUseCase
{
    private FormatRepositoryInterface $repository;

    public function __construct(FormatRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(string $name, int $documentTypeId, ?string $description = null): array
    {
        if (empty(trim($name))) {
            throw new \InvalidArgumentException("El nombre del formato es obligatorio.");
        }

        // Crear registro maestro
        $formatId = $this->repository->create([
            'name' => $name,
            'description' => $description,
            'document_type_id' => $documentTypeId
        ]);

        return [
            'id' => $formatId,
            'name' => $name,
            'document_type_id' => $documentTypeId,
            'message' => 'Formato maestro creado. Listo para crear la primera versión de diseño.'
        ];
    }
}
