<?php

namespace Config;

use CodeIgniter\Database\Config;

/**
 * Database Configuration
 */
class Database extends Config
{
    /**
     * The directory that holds the Migrations and Seeds directories.
     */
    public string $filesPath = APPPATH . 'Database' . DIRECTORY_SEPARATOR;

    /**
     * Lets you choose which connection group to use if no other is specified.
     */
    public string $defaultGroup = 'default';

    /**
     * The default database connection.
     *
     * @var array<string, mixed>
     */
    public array $default = [
        'DSN' => '',
        'hostname' => 'localhost',
        'username' => '',
        'password' => '',
        'database' => '',
        'DBDriver' => 'Postgre',
        'DBPrefix' => '',
        'pConnect' => false,
        'DBDebug' => true,
        'charset' => 'utf8',
        'DBCollat' => 'utf8_general_ci',
        'swapPre' => '',
        'encrypt' => false,
        'compress' => false,
        'strictOn' => false,
        'failover' => [],
        'port' => 3306,
        'numberNative' => false,
        'foundRows' => false,
        'dateFormat' => [
            'date' => 'Y-m-d',
            'datetime' => 'Y-m-d H:i:s',
            'time' => 'H:i:s',
        ],
    ];


    // SQL SERVER Connection Settings
    public array $sqlserver = [
        'DSN' => '',
        'hostname' => 'localhost',
        'username' => 'sa',
        'password' => '',
        'database' => '',
        'DBDriver' => 'SQLSRV',
        'DBPrefix' => '',
        'pConnect' => false,
        'DBDebug' => true,
        'charset' => 'utf8mb4',
        'DBCollat' => 'utf8mb4_general_ci',
        'swapPre' => '',
        'encrypt' => false,
        'compress' => false,
        'strictOn' => false,
        'failover' => [],
        'port' => 1433,
    ];


    /**
     * This database connection is used when running PHPUnit database tests.
     *
     * @var array<string, mixed>
     */
    public array $tests = [
        'DSN' => '',
        'hostname' => '127.0.0.1',
        'username' => '',
        'password' => '',
        'database' => ':memory:',
        'DBDriver' => 'SQLite3',
        'DBPrefix' => 'db_',  // Needed to ensure we're working correctly with prefixes live. DO NOT REMOVE FOR CI DEVS
        'pConnect' => false,
        'DBDebug' => true,
        'charset' => 'utf8',
        'DBCollat' => '',
        'swapPre' => '',
        'encrypt' => false,
        'compress' => false,
        'strictOn' => true,
        'failover' => [],
        'port' => 3306,
        'foreignKeys' => true,
        'busyTimeout' => 1000,
        'synchronous' => null,
        'dateFormat' => [
            'date' => 'Y-m-d',
            'datetime' => 'Y-m-d H:i:s',
            'time' => 'H:i:s',
        ],
    ];

    public function __construct()
    {
        parent::__construct();

        // Ensure that we always set the database group to 'tests' if
        // we are currently running an automated test suite, so that
        // we don't overwrite live data on accident.
        if (ENVIRONMENT === 'testing') {
            $this->defaultGroup = 'tests';
        }

        $this->default['hostname'] = env('DB_HOSTNAME', $this->default['hostname']);
        $this->default['username'] = env('DB_USERNAME', $this->default['username']);
        $this->default['password'] = env('DB_PASSWORD', $this->default['password']);
        $this->default['database'] = env('DB_DATABASE', $this->default['database']);
        $this->default['DBDriver'] = env('DB_DRIVER', $this->default['DBDriver']);
        $this->default['port'] = env('DB_PORT', 5432);

        // SQL SERVER Env Overrides
        $this->sqlserver['hostname'] = env('SQLSRV_HOSTNAME', $this->sqlserver['hostname']);
        $this->sqlserver['username'] = env('SQLSRV_USERNAME', $this->sqlserver['username']);
        $this->sqlserver['password'] = env('SQLSRV_PASSWORD', $this->sqlserver['password']);
        $this->sqlserver['database'] = env('SQLSRV_DATABASE', $this->sqlserver['database']);
        $this->sqlserver['port'] = env('SQLSRV_PORT', 1433);
        $this->sqlserver['encrypt'] = false; // Required to be false for ODBC 18 if not using SSL certificates
    }
}
