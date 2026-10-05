<?php

declare(strict_types=1);

namespace App\Core\Documents\Infrastructure\Services;

use App\Core\Documents\Domain\Services\DocumentEmailServiceInterface;
use CodeIgniter\Config\Services;

class ExternalApiEmailService implements DocumentEmailServiceInterface
{
    public function sendDocument(string $toEmail, string $subject, string $bodyText, string $fileName, string $base64Pdf): bool
    {
        $client = Services::curlrequest();
        
        // Todo: Configurar estas variables en el archivo .env real
        $apiUrl = env('MAIL_API_URL', 'https://api.tuproveedor.com/send');
        $apiToken = env('MAIL_API_TOKEN', 'token_secreto');

        // Este payload variará dependiendo de la estructura exacta que pida tu API externa
        $payload = [
            'to' => $toEmail,
            'subject' => $subject,
            'body' => $bodyText,
            'attachments' => [
                [
                    'filename' => $fileName,
                    'content_base64' => $base64Pdf,
                    'type' => 'application/pdf'
                ]
            ]
        ];

        try {
            // NOTA: Descomentar y ajustar cuando se tenga la URL real de la API
            /*
            $response = $client->post($apiUrl, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $apiToken,
                    'Content-Type'  => 'application/json'
                ],
                'json' => $payload
            ]);
            
            return $response->getStatusCode() >= 200 && $response->getStatusCode() < 300;
            */

            // Simulación de éxito mientras integramos la API real:
            return true;
        } catch (\Exception $e) {
            throw new \Exception("Error al comunicarse con la API de correos: " . $e->getMessage());
        }
    }
}
