<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class DevAccessFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $devKey    = getenv('DEV_ACCESS_KEY') ?: 'serex-dev-starter';
        
        $sentKey   = (string)$request->getHeaderLine('X-Dev-Key');
        if (empty($sentKey)) {
            $sentKey = (string)$request->getGet('dev_key') ?? '';
        }

        if (empty($sentKey) || $sentKey !== $devKey) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => 'error',
                    'code'    => ResponseInterface::HTTP_UNAUTHORIZED,
                    'message' => 'Acceso restringido. Se requiere clave de desarrollador.',
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
