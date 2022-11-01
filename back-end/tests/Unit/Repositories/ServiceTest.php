<?php

namespace Tests\Unit\Repositories;

use App\Models\Service;
use App\Models\User;
use App\Models\ServiceRegistration;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\Service\ServiceRepository;

class ServiceTest extends TestCase
{
    protected $service;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->service = [
            'name' => $this->faker->unique()->word,
            'description' => 'test data',
            'is_compulsory' => rand(0, 1),
            'unit' => $this->faker->name,
            'unit_price' => rand(1, 10) / 10,
        ];
        $this->service_repository = new ServiceRepository();
    }

    public function test_all() {
        $all_services = $this->service_repository->all();
        $this->assertDatabaseCount('services', count($all_services));
    }

    public function test_store() {
        $service = $this->service_repository->store($this->service);
        $this->assertInstanceOf(Service::class, $service);
        $this->assertDatabaseHas('services', $this->service);
    }

    public function test_show() {
        $service = Service::factory()->create(['description' => 'test data']);
        $found_service = $this->service_repository->show($service->id);
        $this->assertInstanceOf(Service::class, $found_service);
        $this->assertEquals($found_service->name, $service->name);
        $this->assertEquals($found_service->description, $service->description);
        $this->assertEquals($found_service->is_compulsory, $service->is_compulsory);
        $this->assertEquals($found_service->unit, $service->unit);
        $this->assertEquals($found_service->unit_price, $service->unit_price);
    }

    public function test_can_update_used_optional_service_to_compulsory_service() {
        $service = $this->service;
        $service['is_compulsory'] = Service::COMPULSORY;
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $test_service = Service::factory()->create(['description' => 'test data', 'is_compulsory' => Service::OPTIONAL]);
        $test_service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $test_service->id]);

        $is_updated = $this->service_repository->update($service, $test_service->id);
        $this->assertFalse($is_updated);
    }

    public function test_can_update_service() {
        $service = Service::factory()->create(['description' => 'test data']);
        $is_service_updated = $this->service_repository->update($this->service, $service->id);
        $this->assertTrue($is_service_updated);
    }

    public function test_delete() {
        $service = Service::factory()->create(['description' => 'test data']);
        $delete_service = $this->service_repository->delete($service->id);
        $this->assertTrue($delete_service);
        $this->assertDatabaseMissing('services', $service->toArray());
    }

    public function test_check_compulsory() {
        $service = Service::factory()->create(['description' => 'test data', 'is_compulsory' => Service::COMPULSORY]);
        $this->assertTrue($this->service_repository->checkCompulsory($service->id));
    }

    public function test_get_registered_services() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); 
        $first_service = Service::factory()->create(['description' => 'test data']);
        $second_service = Service::factory()->create(['description' => 'test data']);
        $first_service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $first_service->id]);
        $first_service_registration = ServiceRegistration::factory()->create(['user_id' => $renter->id, 'service_id' => $second_service->id]);
        $this->assertEquals(count($this->service_repository->getRegisteredServices($renter->id)), 2);
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
