<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class SecurityHeadersFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            $response = service('response');
            $this->applyCorsHeaders($request, $response);
            return $response->setStatusCode(ResponseInterface::HTTP_OK);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $this->applyCorsHeaders($request, $response);
        $this->applySecurityHeaders($response);
        return $response;
    }

    private function applyCorsHeaders(RequestInterface $request, ResponseInterface $response): void
    {
        $allowedOriginsEnv = getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:3000,http://localhost:5173,http://localhost:8080';
        $allowedOrigins    = array_map('trim', explode(',', $allowedOriginsEnv));

        $origin = (string) $request->getHeaderLine('Origin');

        if (!empty($origin)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
            $response->setHeader('Vary', 'Origin');
        } else {
            $response->setHeader('Access-Control-Allow-Origin', '*');
        }

        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, X-API-KEY, Accept');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');
        $response->setHeader('Access-Control-Max-Age', '86400');
    }

    private function applySecurityHeaders(ResponseInterface $response): void
    {
        $response->setHeader('X-Content-Type-Options', 'nosniff');
        $response->setHeader('X-Frame-Options', 'DENY');
        $response->setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        $response->setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->setHeader('X-Powered-By', 'Grupo-Serex-API');
    }
}
