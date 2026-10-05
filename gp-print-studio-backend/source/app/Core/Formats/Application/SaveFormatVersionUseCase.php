<?php

declare(strict_types=1);

namespace App\Core\Formats\Application;

use App\Core\Formats\Domain\Repositories\FormatRepositoryInterface;

class SaveFormatVersionUseCase
{
    private FormatRepositoryInterface $repository;

    public function __construct(FormatRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(string $formatId, array $layoutJson): array
    {
        $format = $this->repository->findById($formatId);
        if (!$format) {
            throw new \Exception("El formato no existe o fue eliminado.", 404);
        }

        if (empty($layoutJson)) {
            throw new \InvalidArgumentException("El layout_json no puede estar vacío.");
        }

        // Determinar siguiente número de versión
        $lastVersion = $this->repository->getLastVersionNumber($formatId);
        $newVersionNumber = $lastVersion + 1;

        // Crear la nueva versión como activa
        $versionId = $this->repository->createVersion([
            'format_id' => $formatId,
            'version_number' => $newVersionNumber,
            'layout_json' => $layoutJson,
            'status' => 'ACTIVE'
        ]);

        // Actualizar el formato maestro para apuntar a la nueva versión
        $this->repository->setActiveVersion($formatId, $versionId);

        // Archivar las versiones anteriores
        $this->repository->archivePreviousVersions($formatId, $versionId);

        return [
            'version_id' => $versionId,
            'version_number' => $newVersionNumber,
            'status' => 'ACTIVE',
            'message' => "Versión {$newVersionNumber} guardada y activada correctamente."
        ];
    }
}
