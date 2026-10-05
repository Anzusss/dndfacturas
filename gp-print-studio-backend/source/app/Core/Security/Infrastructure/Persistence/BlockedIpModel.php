<?php

declare(strict_types=1);

namespace App\Core\Security\Infrastructure\Persistence;

use CodeIgniter\Model;

class BlockedIpModel extends Model
{
    protected $table            = 'blocked_ips';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id',
        'ip_address',
        'reason',
        'attempts',
        'blocked_until',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
}
