<?php

declare(strict_types=1);

namespace App\Core\Shared\Domain\Security;

/**
 * Representa al usuario autenticado extraído del JWT proporcionado por el Identity API.
 */
readonly class AuthenticatedUser
{
    public function __construct(
        public string $sub,
        public string $email,
        public bool $isSuperAdmin,
        public string $clientId,
        public int $iat,
        public int $exp
    ) {
    }

    /**
     * Construye un AuthenticatedUser desde el array del payload JWT decodificado.
     */
    public static function fromPayload(array $payload): self
    {
        return new self(
            sub: $payload['sub'] ?? '',
            email: $payload['email'] ?? '',
            isSuperAdmin: (bool) ($payload['isSuperAdmin'] ?? false),
            clientId: $payload['clientId'] ?? '',
            iat: (int) ($payload['iat'] ?? 0),
            exp: (int) ($payload['exp'] ?? 0)
        );
    }
}
