<?php

declare(strict_types=1);

namespace App\Core\Shared\Application\Context;

use App\Core\Shared\Domain\Security\AuthenticatedUser;

/**
 * Contexto de seguridad para la petición actual.
 * Almacena el usuario autenticado para que pueda ser inyectado en Casos de Uso.
 */
class SecurityContext
{
    private ?AuthenticatedUser $user = null;

    public function setUser(AuthenticatedUser $user): void
    {
        $this->user = $user;
    }

    public function getUser(): ?AuthenticatedUser
    {
        return $this->user;
    }

    public function isAuthenticated(): bool
    {
        return $this->user !== null;
    }
}
