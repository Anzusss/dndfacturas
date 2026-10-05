<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', [\App\Core\System\Presentation\HealthController::class, 'index']);
$routes->get('/health', [\App\Core\System\Presentation\HealthController::class, 'index']);

$routes->get('/test-db', function() {
    try {
        $db = \Config\Database::connect();
        $db->initialize();
        return json_encode(["status" => "success", "message" => "Conexión a la base de datos exitosa."]);
    } catch (\Throwable $e) {
        return json_encode(["status" => "error", "message" => "Error al conectar: " . $e->getMessage()]);
    }
});

// Documentos
$routes->get('/api/documents/summary', [\App\Core\Documents\Presentation\DocumentController::class, 'getSummaryList']);
$routes->get('/api/documents/(:segment)/details', [\App\Core\Documents\Presentation\DocumentController::class, 'getDetails/$1']);
$routes->post('/api/documents/(:segment)/send-email', [\App\Core\Documents\Presentation\DocumentController::class, 'sendEmail/$1']);

// ============================================
// FORMATOS (LAYOUTS)
// ============================================
$routes->group('api/formats', static function ($routes) {
    $routes->get('', [\App\Core\Formats\Presentation\FormatController::class, 'index']);
    $routes->post('', [\App\Core\Formats\Presentation\FormatController::class, 'create']);
    $routes->get('(:segment)', [\App\Core\Formats\Presentation\FormatController::class, 'show/$1']);
    $routes->post('(:segment)/versions', [\App\Core\Formats\Presentation\FormatController::class, 'saveVersion/$1']);
    $routes->get('(:segment)/versions', [\App\Core\Formats\Presentation\FormatController::class, 'listVersions/$1']);
});
