<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBlockedIpsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'       => 'VARCHAR',
                'constraint' => 64,
            ],
            'ip_address' => [
                'type'       => 'VARCHAR',
                'constraint' => 45,
            ],
            'reason' => [
                'type'       => 'VARCHAR',
                'constraint' => 255,
            ],
            'attempts' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 1,
            ],
            'blocked_until' => [
                'type' => 'TIMESTAMP',
            ],
            'created_at' => [
                'type'    => 'TIMESTAMP',
                'default' => null,
            ],
            'updated_at' => [
                'type'    => 'TIMESTAMP',
                'default' => null,
            ],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addKey('ip_address');
        $this->forge->createTable('blocked_ips', true);
    }

    public function down()
    {
        $this->forge->dropTable('blocked_ips', true);
    }
}
