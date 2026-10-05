<?php

declare(strict_types=1);

namespace App\Core\Formats\Application;

use App\Core\Formats\Domain\Repositories\FormatRepositoryInterface;

class GetFormatUseCase
{
    private FormatRepositoryInterface $repository;

    public function __construct(FormatRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(string $formatId): array
    {
        $format = $this->repository->findById($formatId);
        if (!$format) {
            throw new \Exception("Formato no encontrado.", 404);
        }

        $activeLayout = $this->repository->getActiveVersion($formatId);
        $format['active_layout'] = $activeLayout;

        return $format;
    }
}
