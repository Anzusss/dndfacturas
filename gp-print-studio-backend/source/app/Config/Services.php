<?php

namespace Config;

use CodeIgniter\Config\BaseService;

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends BaseService
{
    /*
     * public static function example($getShared = true)
     * {
     *     if ($getShared) {
     *         return static::getSharedInstance('example');
     *     }
     *
     *     return new \CodeIgniter\Example();
     * }
     */

    public static function securityContext($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('securityContext');
        }

        return new \App\Core\Shared\Application\Context\SecurityContext();
    }

    public static function documentSummaryUseCase($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('documentSummaryUseCase');
        }

        return new \App\Core\Documents\Application\GetDocumentSummaryUseCase(
            new \App\Core\Documents\Infrastructure\DocumentRepository()
        );
    }

    public static function documentDetailsUseCase($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('documentDetailsUseCase');
        }

        return new \App\Core\Documents\Application\GetDocumentDetailsUseCase(
            new \App\Core\Documents\Infrastructure\DocumentRepository()
        );
    }

    public static function sendDocumentViaEmailUseCase($getShared = true)
    {
        if ($getShared) return static::getSharedInstance('sendDocumentViaEmailUseCase');
        return new \App\Core\Documents\Application\SendDocumentViaEmailUseCase(
            new \App\Core\Documents\Infrastructure\Services\ExternalApiEmailService()
        );
    }

    // ============================================
    // FORMATOS (LAYOUTS)
    // ============================================

    public static function createFormatUseCase($getShared = true)
    {
        if ($getShared) return static::getSharedInstance('createFormatUseCase');
        return new \App\Core\Formats\Application\CreateFormatUseCase(new \App\Core\Formats\Infrastructure\FormatRepository());
    }

    public static function getFormatUseCase($getShared = true)
    {
        if ($getShared) return static::getSharedInstance('getFormatUseCase');
        return new \App\Core\Formats\Application\GetFormatUseCase(new \App\Core\Formats\Infrastructure\FormatRepository());
    }

    public static function listFormatsUseCase($getShared = true)
    {
        if ($getShared) return static::getSharedInstance('listFormatsUseCase');
        return new \App\Core\Formats\Application\ListFormatsUseCase(new \App\Core\Formats\Infrastructure\FormatRepository());
    }

    public static function saveFormatVersionUseCase($getShared = true)
    {
        if ($getShared) return static::getSharedInstance('saveFormatVersionUseCase');
        return new \App\Core\Formats\Application\SaveFormatVersionUseCase(new \App\Core\Formats\Infrastructure\FormatRepository());
    }
}
