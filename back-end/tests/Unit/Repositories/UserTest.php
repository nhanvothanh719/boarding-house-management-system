<?php

namespace Tests\Unit\Repositories;

use App\Models\User;

use Tests\TestCase;

use \stdClass;

use Illuminate\Support\Str;

use Faker\Factory as Faker;

use App\Repositories\User\UserRepository;

class UserTest extends TestCase
{
    protected $user;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->user = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'password', // password
            'remember_token' => Str::random(10),
            'gender' => random_int(0, 1),
            'date_of_birth' => date('Y-m-d', strtotime(' -20 year')),
            'id_card_number' => $this->faker->unique()->numerify('##########'),
            'phone_number' => $this->faker->unique()->numerify('##########'),
            'occupation' => 'test data',
            'permanent_address' => $this->faker->address(),
            'role' => rand(0, 1),
        ];
        $this->user_repository = new UserRepository();
    }

    public function test_all() {
        $all_users = $this->user_repository->all();
        $this->assertDatabaseCount('users', count($all_users));
    }

    public function test_store() {
        $password = 'password';
        $avatar = null;
        $user = $this->user_repository->store($this->user, $password, $avatar);
        $this->assertInstanceOf(User::class, $user);
        $this->assertDatabaseHas('users', $this->user);
    }

    public function test_show() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $found_user = $this->user_repository->show($user->id);
        $this->assertInstanceOf(User::class, $found_user);
        $this->assertEquals($found_user->name, $user->name);
        $this->assertEquals($found_user->email, $user->email);
    }

    public function test_update() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $is_user_updated = $this->user_repository->update($this->user, $user->id);
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->date_of_birth = $data['date_of_birth'];
        $user->phone_number = $data['phone_number'];
        $user->occupation = $data['occupation'];
        $user->permanent_address = $data['permanent_address'];
        $this->assertTrue($is_user_updated);
    }

    public function test_delete() {
        $user = User::factory()->create(['occupation' => 'test data']);
        $delete_user = $this->user_repository->delete($user->id);
        $this->assertTrue($delete_user);
        $this->assertDatabaseMissing('users', $user->toArray());
    }

    public function tearDown() : void
    {
        User::where('occupation', 'test data')->delete();
        parent::tearDown();
    }
}
