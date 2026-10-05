<?php

declare(strict_types=1);

namespace App\Core\Shared\Infrastructure\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Firebase\JWT\Key;
use Exception;
use RuntimeException;
use CodeIgniter\Config\Services;

class JwtValidator
{
    private string $jwksUri;
    private int $cacheTtl;

    public function __construct()
    {
        $this->jwksUri = getenv('IDENTITY_API_JWKS_URI') ?: 'https://auth.gruposerex.com/api/.well-known/jwks.json';
        $this->cacheTtl = 86400; // 24 horas en caché
    }

    /**
     * Valida el token y retorna el payload como un array asociativo.
     * Si la validación falla (firma incorrecta, expirado, etc.), Firebase\JWT lanzará una Exception.
     */
    public function validate(string $token): array
    {
        $keys = $this->getJwksKeys();
        
        // La decodificación asume algoritmos soportados por las claves JWKS (ej. RS256).
        $decoded = JWT::decode($token, $keys);
        
        return (array) $decoded;
    }

    /**
     * Obtiene y cachea el set de llaves públicas del Identity API.
     * @return array<string, Key>
     */
    private function getJwksKeys(): array
    {
        $cache = Services::cache();
        $cacheKey = 'identity_api_jwks';

        $cachedJwks = $cache->get($cacheKey);

        if ($cachedJwks) {
            $jwks = json_decode($cachedJwks, true);
        } else {
            $jwks = $this->fetchJwks();
            $cache->save($cacheKey, json_encode($jwks), $this->cacheTtl);
        }

        return JWK::parseKeySet($jwks);
    }

    /**
     * Realiza la petición cURL al Identity API para obtener el jwks.json
     */
    private function fetchJwks(): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->jwksUri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false || $httpCode !== 200) {
            throw new RuntimeException("No se pudo obtener JWKS de {$this->jwksUri}. Error: {$error}. HTTP Status: {$httpCode}");
        }

        $decoded = json_decode((string)$response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException("El JSON del JWKS devuelto es inválido.");
        }

        return $decoded;
    }
}
