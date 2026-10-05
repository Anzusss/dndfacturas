<?php

declare(strict_types=1);

namespace App\Core\Shared\Traits;

use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

trait ApiResponseTrait
{
    /**
     * Devuelve una respuesta JSON exitosa estandarizada.
     */
    protected function successResponse(string $message, array|object|null $data = null, int $statusCode = ResponseInterface::HTTP_OK): ResponseInterface
    {
        $response = [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ];

        return Services::response()->setStatusCode($statusCode)->setJSON($response);
    }

    /**
     * Devuelve una respuesta JSON de error estandarizada.
     */
    protected function errorResponse(string $message, int $statusCode = ResponseInterface::HTTP_BAD_REQUEST, array $errors = null): ResponseInterface
    {
        $response = [
            'status' => 'error',
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return Services::response()->setStatusCode($statusCode)->setJSON($response);
    }
}
