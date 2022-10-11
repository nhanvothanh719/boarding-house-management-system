<?php

namespace Tests\Unit\Repositories;

use App\Models\Service;

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
            'name' => $this->faker->word,
            'description' => $this->faker->paragraph,
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
        $service = Service::factory()->create();
        $found_service = $this->service_repository->show($service->id);
        $this->assertInstanceOf(Service::class, $found_service);
        $this->assertEquals($found_service->name, $service->name);
        $this->assertEquals($found_service->description, $service->description);
        $this->assertEquals($found_service->is_compulsory, $service->is_compulsory);
        $this->assertEquals($found_service->unit, $service->unit);
        $this->assertEquals($found_service->unit_price, $service->unit_price);
    }

    public function test_update_used_optional_service_to_compulsory_service() {
        //
    }

    public function test_update_service() {
        $service = Service::factory()->create();
        $is_service_updated = $this->service_repository->update($this->service, $service->id);
        $this->assertTrue($is_service_updated);
    }

    public function test_delete() {
        $service = Service::factory()->create();
        $delete_service = $this->service_repository->delete($service->id);
        $this->assertTrue($delete_service);
        $this->assertDatabaseMissing('services', $service->toArray());
    }
}
