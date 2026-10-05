<?php

declare(strict_types=1);

namespace App\Core\System\Presentation;

use App\Controllers\BaseController;
use App\Core\Shared\Traits\ApiResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Database;

class HealthController extends BaseController
{
    use ApiResponseTrait;

    public function index(): ResponseInterface
    {
        $dbStatus = 'disconnected';
        try {
            $db = Database::connect();
            // Intenta realizar una consulta ligera para verificar la conexión real
            if ($db->query('SELECT 1')->getResult()) {
                $dbStatus = 'connected';
            }
        } catch (\Throwable $th) {
            $dbStatus = 'error: ' . $th->getMessage();
        }

        $data = [
            'app' => 'Grupo Serex API Starter',
            'version' => '1.0.0',
            'environment' => ENVIRONMENT,
            'services' => [
                'database' => $dbStatus,
                'identity_api' => 'enabled'
            ],
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'documentation' => base_url('api/docs') // Enlace futuro a Swagger
        ];

        return $this->successResponse('System is healthy', $data);
    }
}
