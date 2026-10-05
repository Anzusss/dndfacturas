<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RateLimitFilter implements FilterInterface
{
    private const PRIVATE_MAX_REQUESTS = 1000;
    private const PUBLIC_MAX_REQUESTS = 300;
    private const WINDOW_SECONDS = 60;

    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return;
        }

        $throttler = service('throttler');
        $ipAddress = $request->getIPAddress();
        
        $token = $request->getCookie('serex_access_token');
        $userId = null;

        // Decodificación ultra-rápida del token (sin validar firma) solo para identificar
        // al usuario a nivel de rate limit. La validación real ocurre en IdentityAuthFilter.
        if (!empty($token)) {
            $parts = explode('.', (string)$token);
            if (count($parts) === 3) {
                $payload = json_decode(base64_decode($parts[1]), true);
                if (is_array($payload) && isset($payload['sub'])) {
                    $userId = (string) $payload['sub'];
                }
            }
        }

        if ($userId) {
            $key = 'rate_limit_private_' . md5($userId);
            $maxReqs = self::PRIVATE_MAX_REQUESTS;
            $limitType = 'private (' . self::PRIVATE_MAX_REQUESTS . ' req/min)';
        } else {
            $key = 'rate_limit_public_' . md5($ipAddress);
            $maxReqs = self::PUBLIC_MAX_REQUESTS;
            $limitType = 'public (' . self::PUBLIC_MAX_REQUESTS . ' req/min)';
        }

        if ($throttler->check($key, $maxReqs, self::WINDOW_SECONDS) === false) {
            $response = service('response');
            
            $response->setHeader('X-RateLimit-Limit', (string) $maxReqs);
            $response->setHeader('X-RateLimit-Remaining', '0');
            $response->setHeader('Retry-After', (string) self::WINDOW_SECONDS);

            return $response
                ->setStatusCode(ResponseInterface::HTTP_TOO_MANY_REQUESTS)
                ->setJSON([
                    'status'              => 'error',
                    'code'                => ResponseInterface::HTTP_TOO_MANY_REQUESTS,
                    'message'             => 'Ha superado el límite de peticiones permitido. Por favor espere antes de realizar otra solicitud.',
                    'retry_after_seconds' => self::WINDOW_SECONDS,
                    'limit_type'          => $limitType,
                ]);
        }

        $remainingTokens = service('cache')->get('throttler_' . $key);
        $remaining       = is_numeric($remainingTokens) ? (int) floor((float) $remainingTokens) : $maxReqs - 1;

        $response = service('response');
        $response->setHeader('X-RateLimit-Limit', (string) $maxReqs);
        $response->setHeader('X-RateLimit-Remaining', (string) max($remaining, 0));
        $response->setHeader('X-RateLimit-Limit-Type', $limitType);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
