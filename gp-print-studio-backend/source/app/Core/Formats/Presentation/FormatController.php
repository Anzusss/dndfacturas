<?php

declare(strict_types=1);

namespace App\Core\Formats\Presentation;

use App\Controllers\BaseController;
use App\Core\Shared\Traits\ApiResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class FormatController extends BaseController
{
    use ApiResponseTrait;

    public function index(): ResponseInterface
    {
        try {
            $useCase = Services::listFormatsUseCase();
            $formats = $useCase->execute();
            return $this->successResponse('Formatos listados correctamente', $formats);
        } catch (\Throwable $th) {
            return $this->errorResponse('Error al listar formatos: ' . $th->getMessage());
        }
    }

    public function show(string $id): ResponseInterface
    {
        try {
            $useCase = Services::getFormatUseCase();
            $format = $useCase->execute($id);
            return $this->successResponse('Detalles del formato', $format);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse($e->getMessage(), 404);
            }
            return $this->errorResponse('Error al obtener formato: ' . $e->getMessage());
        }
    }

    public function create(): ResponseInterface
    {
        try {
            $json = $this->request->getJSON(true);
            $name = $json['name'] ?? '';
            $documentTypeId = (int) ($json['document_type_id'] ?? 0);
            $description = $json['description'] ?? null;

            $useCase = Services::createFormatUseCase();
            $result = $useCase->execute($name, $documentTypeId, $description);

            return $this->successResponse('Formato creado', $result, 201);
        } catch (\InvalidArgumentException $e) {
            return $this->errorResponse($e->getMessage(), 400);
        } catch (\Throwable $th) {
            return $this->errorResponse('Error interno: ' . $th->getMessage(), 500);
        }
    }

    public function saveVersion(string $id): ResponseInterface
    {
        try {
            $json = $this->request->getJSON(true);
            $layoutJson = $json['layout_json'] ?? [];

            $useCase = Services::saveFormatVersionUseCase();
            $result = $useCase->execute($id, $layoutJson);

            return $this->successResponse('Versión guardada', $result, 201);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return $this->errorResponse($e->getMessage(), 404);
            }
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function listVersions(string $id): ResponseInterface
    {
        try {
            // Se puede hacer en UseCase, pero por simpleza y lectura directa:
            $repo = new \App\Core\Formats\Infrastructure\FormatRepository();
            $versions = $repo->getVersionsHistory($id);
            return $this->successResponse('Historial de versiones', $versions);
        } catch (\Throwable $th) {
            return $this->errorResponse('Error interno: ' . $th->getMessage(), 500);
        }
    }
}
