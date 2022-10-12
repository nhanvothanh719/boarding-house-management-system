<?php

namespace Tests\Unit\Repositories;

use App\Models\PasswordReset;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\User\UserRepository;
use App\Repositories\PasswordReset\PasswordResetRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use \stdClass;

class PasswordResetTest extends TestCase
{
    protected $password_reset;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $user = User::factory()->create(['occupation' => 'test data']);
        $this->password_reset = [
            'email' => $user->email,
            'token' => $this->faker->numerify('###'),
        ];
        $this->password_reset_repository = new PasswordResetRepository(new UserRepository());
    }

    public function test_store() {
        $password_reset = $this->password_reset_repository->store($this->password_reset);
        $this->assertInstanceOf(PasswordReset::class, $password_reset);
    }

    public function test_delete_old_password() {
        $data = array();
        $user = User::factory()->create(['occupation' => 'test data']);
        $password_reset = PasswordReset::factory()->create(['email' => $user->email]);
        $data['password'] = 'password';
        $data['email'] = $user->email;
        $delete_old_password = $this->password_reset_repository->updatePassword($data);
        $this->assertDatabaseMissing('password_resets', $password_reset->toArray());
    }

    public function tearDown() : void
    {
        $all_renter_emails = User::where('occupation', 'test data')->pluck('email');
        foreach($all_renter_emails as $renter_email) {
            PasswordReset::where('email', $renter_email)->delete();
        }
        User::where('occupation', 'test data')->delete();
        parent::tearDown();
    }
}
