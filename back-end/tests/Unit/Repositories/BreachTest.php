<?php

namespace Tests\Unit\Repositories;

use App\Models\Breach;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\Breach\BreachRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BreachTest extends TestCase
{
    protected $breach;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->breach = [
            'name' => $this->faker->unique()->word(), 
            'description' => 'test data',
            'severity_level' => rand(1, 4),
            'allowed_violate_number' => rand(2, 7),
        ];
        $this->breach_repository = new BreachRepository();
    }

    public function test_all() {
        $all_breaches = $this->breach_repository->all();
        $this->assertDatabaseCount('breaches', count($all_breaches));
    }

    public function test_store() {
        $breach = $this->breach_repository->store($this->breach);
        $this->assertInstanceOf(Breach::class, $breach);
        $this->assertDatabaseHas('breaches', $this->breach);
    }

    public function test_show() {
        $breach = Breach::factory()->create(['description' => 'test data']);
        $found_breach = $this->breach_repository->show($breach->id);
        $this->assertInstanceOf(Breach::class, $found_breach);
        $this->assertEquals($found_breach->name, $breach->name);
        $this->assertEquals($found_breach->description, $breach->description);
        $this->assertEquals($found_breach->severity_level, $breach->severity_level);
        $this->assertEquals($found_breach->allowed_violate_number, $breach->allowed_violate_number);
    }

    public function test_update() {
        $breach = Breach::factory()->create(['description' => 'test data']);
        $new_breach = $this->breach_repository->update($this->breach, $breach->id);
        $this->assertInstanceOf(Breach::class, $new_breach);
        $this->assertEquals($new_breach->name, $this->breach['name']);
        $this->assertEquals($new_breach->description, $this->breach['description']);
        $this->assertEquals($new_breach->severity_level, $this->breach['severity_level']);
        $this->assertEquals($new_breach->allowed_violate_number, $this->breach['allowed_violate_number']);
        //Test if the database is updated
        $this->assertDatabaseHas('breaches', $this->breach);
    }

    public function test_delete() {
        $breach = Breach::factory()->create(['description' => 'test data']);
        $delete_breach = $this->breach_repository->delete($breach->id);
        $this->assertTrue($delete_breach);
        $this->assertDatabaseMissing('breaches', $breach->toArray());
    }

    public function tearDown() : void
    {
        Breach::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
