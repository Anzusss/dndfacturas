<?php

declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Core\Security\Infrastructure\Persistence\SqlBlockedIpRepository;
use App\Core\Shared\Utils\AttackDetector;

class SecurityGuardFilter implements FilterInterface
{
    private const BLOCK_DURATION_SECONDS = 86400; // 24 horas

    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return;
        }

        $ip = $request->getIPAddress();
        $repository = new SqlBlockedIpRepository();

        if ($repository->isBlocked($ip)) {
            $this->logAttempt($ip, 'IP bloqueada previamente', $request);
            return $this->forbidden();
        }

        $attack = $this->inspect($request);
        if ($attack !== null) {
            $repository->block($ip, $attack, self::BLOCK_DURATION_SECONDS);
            $this->logAttempt($ip, $attack, $request);
            return $this->forbidden();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }

    private function inspect(RequestInterface $request): ?string
    {
        $samples = [];
        $uri = (string) $request->getUri();
        $query = (string) $request->getUri()->getQuery();
        
        if ($query !== '') {
            $samples[] = $query;
        }
        $samples[] = $uri;

        foreach ($request->headers() as $name => $header) {
            if (strtolower((string) $name) === 'user-agent') {
                continue;
            }
            $samples[] = $header->getValueLine();
        }

        foreach ($samples as $sample) {
            $detected = AttackDetector::detect(AttackDetector::normalize((string) $sample));
            if ($detected !== null) {
                return $detected;
            }
        }

        return null;
    }

    private function logAttempt(string $ip, string $reason, RequestInterface $request): void
    {
        $line = sprintf(
            '[%s] SECURITY BLOCK ip=%s reason="%s" method=%s uri=%s agent=%s',
            gmdate('Y-m-d H:i:s'),
            $ip,
            $reason,
            $request->getMethod(),
            (string) $request->getUri(),
            $request->getUserAgent() ?? ''
        );
        log_message('error', $line);
    }

    private function forbidden(): ResponseInterface
    {
        $response = service('response')
            ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN)
            ->setJSON([
                'status'  => 'error',
                'code'    => ResponseInterface::HTTP_FORBIDDEN,
                'message' => 'Acceso denegado. Su dirección IP ha sido bloqueada por actividad sospechosa.',
            ]);

        $origin = (string) service('request')->getHeaderLine('Origin');
        if (!empty($origin)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
            $response->setHeader('Vary', 'Origin');
        } else {
            $response->setHeader('Access-Control-Allow-Origin', '*');
        }
        
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, X-API-KEY, Accept');
        $response->setHeader('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
