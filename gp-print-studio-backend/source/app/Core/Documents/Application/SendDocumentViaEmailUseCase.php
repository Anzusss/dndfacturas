<?php

declare(strict_types=1);

namespace App\Core\Documents\Application;

use App\Core\Documents\Domain\Services\DocumentEmailServiceInterface;

class SendDocumentViaEmailUseCase
{
    private DocumentEmailServiceInterface $emailService;

    public function __construct(DocumentEmailServiceInterface $emailService)
    {
        $this->emailService = $emailService;
    }

    public function execute(string $documentNumber, string $toEmail, string $base64Pdf): array
    {
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("La dirección de correo '{$toEmail}' no es válida.");
        }

        if (empty($base64Pdf)) {
            throw new \InvalidArgumentException("El archivo PDF codificado no puede estar vacío.");
        }

        // Limpieza de cadena base64 en caso de que el Frontend envíe el meta-header data:application/pdf
        if (strpos($base64Pdf, 'base64,') !== false) {
            $parts = explode('base64,', $base64Pdf);
            $base64Pdf = $parts[1];
        }

        $subject = "Envío de Documento: {$documentNumber}";
        $body = "Saludos cordiales. Adjunto a este correo encontrará el documento {$documentNumber} en formato PDF.";
        $fileName = "{$documentNumber}.pdf";

        $success = $this->emailService->sendDocument($toEmail, $subject, $body, $fileName, $base64Pdf);

        if (!$success) {
            throw new \Exception("El proveedor externo de correos rechazó la petición.");
        }

        // Aquí en el futuro se podría registrar en la BD una tabla de auditoría "document_emails_sent"

        return [
            'document_number' => $documentNumber,
            'sent_to' => $toEmail,
            'message' => 'Correo enviado exitosamente mediante la API externa.'
        ];
    }
}
