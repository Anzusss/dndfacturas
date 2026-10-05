<?php

declare(strict_types=1);

namespace App\Core\Security\Domain\Repositories;

interface BlockedIpRepositoryInterface
{
    /**
     * Verifica si una IP se encuentra bloqueada en el momento actual.
     */
    public function isBlocked(string $ipAddress): bool;

    /**
     * Registra (o incrementa el contador de) una IP bloqueada con el motivo
     * del bloqueo y la duración en segundos.
     */
    public function block(string $ipAddress, string $reason, int $durationSeconds): bool;
}
