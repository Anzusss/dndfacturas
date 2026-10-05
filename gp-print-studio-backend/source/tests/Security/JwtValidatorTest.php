<?php

declare(strict_types=1);

namespace Tests\Security;

use CodeIgniter\Test\CIUnitTestCase;
use App\Core\Shared\Infrastructure\Security\JwtValidator;
use Exception;

class JwtValidatorTest extends CIUnitTestCase
{
    public function test_jwt_validator_instantiates_correctly()
    {
        $validator = new JwtValidator();
        $this->assertInstanceOf(JwtValidator::class, $validator);
    }

    public function test_validate_throws_exception_on_invalid_token()
    {
        $validator = new JwtValidator();

        $this->expectException(Exception::class);
        
        // This will fail because the token is malformed and it will also attempt to fetch JWKS
        // For a true unit test, we should mock the getJwksKeys method or the Cache service.
        $validator->validate('invalid.token.structure');
    }
}
