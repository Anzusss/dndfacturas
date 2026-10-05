<?php

declare(strict_types=1);

namespace App\Core\Documents\Presentation;

use App\Controllers\BaseController;
use App\Core\Shared\Traits\ApiResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;


use App\Core\Documents\Application\GetDocumentSummaryUseCase;

class DocumentController extends BaseController
{
    use ApiResponseTrait;

    /**
     * Endpoint: GET /api/documents/summary
     */
    public function getSummaryList(): ResponseInterface
    {
        try {
            // 1. Recolección de parámetros entrantes
            $page = (int) ($this->request->getGet('page') ?? 1);
            $perPage = (int) ($this->request->getGet('per_page') ?? 10);

            $search = $this->request->getGet('search');

            // 2. Resolvemos el UseCase dentro del bloque try-catch para capturar cualquier error de instanciación
            $useCase = Services::documentSummaryUseCase();
            $result = $useCase->execute($page, $perPage, $search);

            // 3. Respuesta JSON formateada y limpia
            return $this->successResponse('Documentos recuperados exitosamente', [
                'items' => $result['items'],
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'total_items' => $result['total_items'],
                    'total_pages' => $result['total_pages'],
                ]
            ]);
        } catch (\Throwable $th) {
            // Manejo global de errores para este endpoint
            return $this->errorResponse('Error al obtener los documentos: ' . $th->getMessage());
        }
    }

    /**
     * Endpoint: GET /api/documents/(:segment)/details
     */
    public function getDetails(string $documentNumber): ResponseInterface
    {
        try {
            // Resolvemos el caso de uso
            $useCase = Services::documentDetailsUseCase();
            $result = $useCase->execute($documentNumber);

            return $this->successResponse('Detalles del documento recuperados', $result);
        } catch (\Exception $e) {
            // 404 si no se encontró
            if ($e->getCode() === 404) {
                return $this->errorResponse($e->getMessage(), 404);
            }
            return $this->errorResponse('Error al obtener detalles: ' . $e->getMessage());
        } catch (\Throwable $th) {
            return $this->errorResponse('Error interno: ' . $th->getMessage());
        }
    }

    /**
     * Endpoint: POST /api/documents/(:segment)/send-email
     */
    public function sendEmail(string $documentNumber): ResponseInterface
    {
        try {
            $json = $this->request->getJSON(true);
            $toEmail = $json['to_email'] ?? '';
            $base64Pdf = $json['pdf_base64'] ?? '';

            $useCase = Services::sendDocumentViaEmailUseCase();
            $result = $useCase->execute($documentNumber, $toEmail, $base64Pdf);

            return $this->successResponse('Correo enviado exitosamente', $result);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Exception $e) {
            return $this->errorResponse('Error al enviar correo: ' . $e->getMessage(), 500);
        }
    }
}
