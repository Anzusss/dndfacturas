<?php

declare(strict_types=1);

namespace App\Core\Shared\Utils;

/**
 * Detecta patrones típicos de ataques (SQL Injection, XSS, command injection,
 * path traversal) en cadenas de entrada. Devuelve la descripción del ataque
 * detectado o null si la entrada parece inofensiva.
 */
class AttackDetector
{
    /** @var list<array{pattern: string, label: string}> */
    private const RULES = [
        // SQL Injection: comentarios y uniones
        ['pattern' => '/union\s+(all\s+)?select\b/i',                 'label' => 'SQL Injection: UNION SELECT'],
        ['pattern' => '/\bselect\b.{0,80}\bfrom\b.{0,80}(users|passwords?|admin|information_schema)/is', 'label' => 'SQL Injection: SELECT FROM tabla sensible'],
        ['pattern' => '/information_schema\./i',                      'label' => 'SQL Injection: information_schema'],
        ['pattern' => '/\b(or|and)\s+[\'"\w]+\s*=\s*[\'"\w]+\s*(--|#|\/\*|;)?/i', 'label' => 'SQL Injection: condición tautológica'],
        ['pattern' => '/\b(or|and)\s+\d+\s*=\s*\d+/i',                'label' => 'SQL Injection: OR/AND 1=1'],
        ['pattern' => "/'(\s*(or|and)\s*|\s*--\s*|\s*#|\s*\/\*)/i",   'label' => 'SQL Injection: comilla simple maliciosa'],
        ['pattern' => '/\b(sleep|pg_sleep|benchmark|waitfor|delay)\s*\(/i', 'label' => 'SQL Injection: time-based (SLEEP/BENCHMARK)'],
        ['pattern' => '/\b(exec|execute|xp_cmdshell|sp_)\b/i',        'label' => 'SQL Injection: EXEC/xp_cmdshell'],
        ['pattern' => '/\b(drop|truncate|alter|create)\s+(table|database|schema|index)\b/i', 'label' => 'SQL Injection: DDL destructivo'],
        ['pattern' => '/;\s*(drop|truncate|alter|insert|update|delete|exec|select)\b/i',    'label' => 'SQL Injection: múltiples sentencias (stacked)'],
        ['pattern' => '/\bupdate\b.{0,80}\bset\b/i',                  'label' => 'SQL Injection: UPDATE ... SET'],
        ['pattern' => '/\bdelete\b.{0,80}\bfrom\b/i',                 'label' => 'SQL Injection: DELETE FROM'],
        ['pattern' => '/\binsert\b.{0,80}\binto\b/i',                 'label' => 'SQL Injection: INSERT INTO'],
        ['pattern' => '/0x[0-9a-f]{8,}/i',                            'label' => 'SQL Injection: literal hexadecimal'],
        ['pattern' => '/\bconcat\s*\(/i',                             'label' => 'SQL Injection: CONCAT()'],
        ['pattern' => '/\bcast\s*\(/i',                               'label' => 'SQL Injection: CAST()'],
        ['pattern' => '/\bgroup\s+by\b.{0,80}\bhaving\b/i',           'label' => 'SQL Injection: GROUP BY ... HAVING'],

        // XSS
        ['pattern' => '/<\s*script\b/i',                              'label' => 'XSS: etiqueta <script>'],
        ['pattern' => '/<\s*iframe\b/i',                              'label' => 'XSS: etiqueta <iframe>'],
        ['pattern' => '/javascript\s*:/i',                            'label' => 'XSS: javascript:'],
        ['pattern' => '/\bon(load|error|click|mouseover|focus|blur)\s*=/i', 'label' => 'XSS: manejador de evento on*'],
        ['pattern' => '/<img[^>]*\bsrc\s*=/i',                        'label' => 'XSS: <img src=...>'],
        ['pattern' => '/vbscript\s*:/i',                              'label' => 'XSS: vbscript:'],
        ['pattern' => '/data\s*:\s*text\/html/i',                     'label' => 'XSS: data:text/html'],
        ['pattern' => '/document\.cookie/i',                          'label' => 'XSS: document.cookie'],
        ['pattern' => '/alert\s*\(/i',                                'label' => 'XSS: alert()'],
        ['pattern' => '/<\s*svg\b[^>]*\bon/i',                        'label' => 'XSS: SVG con on*'],

        // Command Injection
        ['pattern' => '/\b(cmd\.exe|powershell|wget|curl|nc\.exe|netcat|\/bin\/sh|\/bin\/bash)\b/i', 'label' => 'Command Injection: binario del sistema'],
        ['pattern' => '/(?:;|`|\|)\s*(ls|cat|whoami|id|rm|mkdir|chmod|echo|sh|bash|python|perl)\b/i', 'label' => 'Command Injection: comando shell'],
        ['pattern' => '/\$\([^)]*\)/i',                              'label' => 'Command Injection: sustitución $()'],
        ['pattern' => '/`[^`]*`/i',                                  'label' => 'Command Injection: backticks'],

        // Path Traversal
        ['pattern' => '/\.\.\//',                                'label' => 'Path Traversal: ../'],
        ['pattern' => '/%2e%2e%2f/i',                          'label' => 'Path Traversal: URL encoded ../'],
        ['pattern' => '/%2e%2e%5c/i',                          'label' => 'Path Traversal: URL encoded ..\\'],

        // Malformación / cabeceras de ataque
        ['pattern' => '/\\\\0/i',                                    'label' => 'Null byte injection'],
        ['pattern' => '/\bchar\s*\(\d+/i',                           'label' => 'SQL Injection: CHAR()'],
    ];

    /**
     * Inspecciona una cadena (ya normalizada) en busca de ataques.
     */
    public static function detect(string $input): ?string
    {
        if ($input === '') {
            return null;
        }

        foreach (self::RULES as $rule) {
            if (preg_match($rule['pattern'], $input) === 1) {
                return $rule['label'];
            }
        }

        return null;
    }

    /**
     * Normaliza una entrada para evadir ofuscación simple (doble codificación,
     * mayúsculas, espacios extra) antes de aplicar las reglas.
     */
    public static function normalize(string $input): string
    {
        $decoded = urldecode($input);
        $decoded = rawurldecode($decoded);
        $decoded = str_ireplace(['\x', '\\x'], '', $decoded);
        $decoded = preg_replace('/\s+/', ' ', $decoded) ?? $decoded;

        return $decoded;
    }
}
