<?php

namespace Tests\Unit\Repositories;

use App\Models\Motorbike;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\Motorbike\MotorbikeRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MotorbikeTest extends TestCase
{
    protected $motorbike;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        // Prepare data for test
        $this->motorbike = [
            'renter_id' => $renter->id,
            'license_plate' => $this->faker->unique()->numerify('ABC######'),
        ];
        $this->motorbike_repository = new MotorbikeRepository();
    }

    public function test_all() {
        $all_motorbikes = $this->motorbike_repository->all();
        $this->assertDatabaseCount('motorbikes', count($all_motorbikes));
    }

    public function test_store() {
        $motorbike = $this->motorbike_repository->store($this->motorbike);
        $this->assertInstanceOf(Motorbike::class, $motorbike);
        $this->assertDatabaseHas('motorbikes', $this->motorbike);
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $motorbike = Motorbike::factory()->create(['renter_id' => $renter->id]);
        $found_motorbike = $this->motorbike_repository->show($motorbike->id);
        $this->assertInstanceOf(Motorbike::class, $found_motorbike);
        $this->assertEquals($found_motorbike->renter_id, $motorbike->renter_id);
        $this->assertEquals($found_motorbike->license_plate, $motorbike->license_plate);
    }

    public function test_update() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $motorbike = Motorbike::factory()->create(['renter_id' => $renter->id]);
        $new_motorbike = $this->motorbike_repository->update($this->motorbike, $motorbike->id);
        $this->assertInstanceOf(Motorbike::class, $new_motorbike);
        $this->assertEquals($new_motorbike->renter_id, $this->motorbike['renter_id']);
        $this->assertEquals($new_motorbike->license_plate, $this->motorbike['license_plate']);
        //Test if the database is updated
        $this->assertDatabaseHas('motorbikes', $this->motorbike);
    }

    public function test_delete() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $motorbike = Motorbike::factory()->create(['renter_id' => $renter->id]);
        $delete_motorbike = $this->motorbike_repository->delete($motorbike->id);
        $this->assertTrue($delete_motorbike);
        $this->assertDatabaseMissing('motorbikes', $motorbike->toArray());
    }
    
    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            Motorbike::where('renter_id', $renter_id)->delete();
            User::where('id', $renter_id)->delete();
        }
        parent::tearDown();
    }
}
