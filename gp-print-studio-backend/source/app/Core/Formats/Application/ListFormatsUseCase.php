<?php

declare(strict_types=1);

namespace App\Core\Formats\Application;

use App\Core\Formats\Domain\Repositories\FormatRepositoryInterface;

class ListFormatsUseCase
{
    private FormatRepositoryInterface $repository;

    public function __construct(FormatRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
