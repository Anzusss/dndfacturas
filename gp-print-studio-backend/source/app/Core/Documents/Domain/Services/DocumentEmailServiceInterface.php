<?php

declare(strict_types=1);

namespace App\Core\Documents\Domain\Services;

interface DocumentEmailServiceInterface
{
    /**
     * Envía un documento PDF codificado en base64 a un destinatario.
     */
    public function sendDocument(string $toEmail, string $subject, string $bodyText, string $fileName, string $base64Pdf): bool;
}
