<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\API\ResponseTrait;
use App\Core\Shared\Infrastructure\Security\JwtValidator;
use App\Core\Shared\Domain\Security\AuthenticatedUser;
use Config\Services;
use Exception;

class IdentityAuthFilter implements FilterInterface
{
    use ResponseTrait;

    protected $response;
    protected $request;

    public function before(RequestInterface $request, $arguments = null)
    {
        $this->request = $request;
        $this->response = Services::response();

        // Extraer el token de las cookies según especificaciones
        $cookieName = 'serex_access_token';
        $token = $request->getCookie($cookieName);

        if (empty($token)) {
            return $this->failUnauthorized('No se encontró la cookie de acceso (serex_access_token).');
        }

        try {
            $validator = new JwtValidator();
            // Validate lanza excepción si el token es inválido o expiró
            $payload = $validator->validate((string)$token);

            $user = AuthenticatedUser::fromPayload($payload);
            
            // Establecer el usuario en el contexto de seguridad global
            $securityContext = Services::securityContext();
            $securityContext->setUser($user);

        } catch (Exception $e) {
            return $this->failUnauthorized('Token inválido o expirado: ' . $e->getMessage());
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed after the controller executes
    }
}
