<?php

namespace Tests\Unit\Repositories;

use App\Models\ServiceRegistration;
use App\Models\Service;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\ServiceRegistration\ServiceRegistrationRepository;
use App\Repositories\User\UserRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServiceRegistrationTest extends TestCase
{
    protected $service_registration;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $service = Service::factory()->create(['description' => 'test data']);
        $this->service_registration = [
            'user_id' => $renter->id,
            'service_id' => $service->id,
        ];
        $this->service_registration_repository = new ServiceRegistrationRepository(new UserRepository());
    }

    public function test_all() {
        $all_service_registrations = $this->service_registration_repository->all();
        $this->assertDatabaseCount('service_registrations', count($all_service_registrations));
    }

    public function test_store() {
        $service_registration = $this->service_registration_repository->store($this->service_registration);
        $this->assertInstanceOf(ServiceRegistration::class, $service_registration);
        $this->assertDatabaseHas('service_registrations', $this->service_registration);
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $service = Service::factory()->create(['description' => 'test data']);
        $service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $service->id,]);
        $found_service_registration = $this->service_registration_repository->show($service_registration->id);
        $this->assertInstanceOf(ServiceRegistration::class, $found_service_registration);
        $this->assertEquals($found_service_registration->user_id, $service_registration->user_id);
        $this->assertEquals($found_service_registration->service_id, $service_registration->service_id);
    }

    public function test_delete() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $service = Service::factory()->create(['description' => 'test data']);
        $service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $service->id,]);
        $delete_service_registration = $this->service_registration_repository->delete($service_registration->id);
        $this->assertTrue($delete_service_registration);
        $this->assertDatabaseMissing('service_registrations', $service_registration->toArray());
    }

    public function test_check_exist() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $service = Service::factory()->create(['description' => 'test data']);
        $service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $service->id,]);
        $is_existed = $this->service_registration_repository->checkExisted($renter->id, $service->id);
        $this->assertTrue($is_existed);
    }

    public function test_check_not_exist() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $service = Service::factory()->create(['description' => 'test data']);
        $is_existed = $this->service_registration_repository->checkExisted($renter->id, $service->id);
        $this->assertFalse($is_existed);
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            ServiceRegistration::where('user_id', $renter_id)->delete();
            User::where('id', $renter_id)->delete();
        }
        Service::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
