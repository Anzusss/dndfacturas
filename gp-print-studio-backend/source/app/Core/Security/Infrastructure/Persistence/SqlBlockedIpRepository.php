<?php

declare(strict_types=1);

namespace App\Core\Security\Infrastructure\Persistence;

use App\Core\Security\Domain\Repositories\BlockedIpRepositoryInterface;
use App\Core\Shared\Utils\UuidGenerator;

class SqlBlockedIpRepository implements BlockedIpRepositoryInterface
{
    private BlockedIpModel $model;

    public function __construct()
    {
        $this->model = new BlockedIpModel();
    }

    public function isBlocked(string $ipAddress): bool
    {
        $row = $this->model
            ->where('ip_address', $ipAddress)
            ->where('blocked_until >=', gmdate('Y-m-d H:i:s'))
            ->first();

        return $row !== null;
    }

    public function block(string $ipAddress, string $reason, int $durationSeconds): bool
    {
        $now = gmdate('Y-m-d H:i:s');
        $until = gmdate('Y-m-d H:i:s', time() + $durationSeconds);

        $existing = $this->model
            ->where('ip_address', $ipAddress)
            ->first();

        if ($existing !== null) {
            return (bool) $this->model->update($existing['id'], [
                'reason'        => $reason,
                'attempts'      => (int) ($existing['attempts'] ?? 0) + 1,
                'blocked_until' => $until,
                'updated_at'    => $now,
            ]);
        }

        return (bool) $this->model->insert([
            'id'            => UuidGenerator::v4(),
            'ip_address'    => $ipAddress,
            'reason'        => $reason,
            'attempts'      => 1,
            'blocked_until' => $until,
            'created_at'    => $now,
            'updated_at'    => $now,
        ]);
    }
}
