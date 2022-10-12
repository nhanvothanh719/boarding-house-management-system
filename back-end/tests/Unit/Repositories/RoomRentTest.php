<?php

namespace Tests\Unit\Repositories;

use App\Models\RoomRent;
use App\Models\Room;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\RoomContract\RoomRentRepository;
use App\Repositories\User\UserRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomRentTest extends TestCase
{
    protected $room_rent;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data']);
        $this->room_rent = [
            'renter_id' => $renter->id,
            'room_id' => $room->id,
        ];
        $this->room_rent_repository = new RoomRentRepository(new UserRepository());
    }

    public function test_all() {
        $all_room_rents = $this->room_rent_repository->all();
        $this->assertDatabaseCount('room_rents', count($all_room_rents));
    }

    public function test_store() {
        $room_rent = $this->room_rent_repository->store($this->room_rent);
        $this->assertInstanceOf(RoomRent::class, $room_rent);
        $this->assertDatabaseHas('room_rents', $this->room_rent);
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER], ['occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED], ['description' => 'test data']);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id,'room_id' => $room->id,]);
        $found_room_rent = $this->room_rent_repository->show($room_rent->id);
        $this->assertInstanceOf(RoomRent::class, $found_room_rent);
        $this->assertEquals($found_room_rent->renter_id, $room_rent->renter_id);
        $this->assertEquals($found_room_rent->room_id, $room_rent->room_id);
    }
    
    public function test_accept_room_with_full_status() {
        $room = Room::factory()->create(['status' => Room::STATUS_FULL], ['description' => 'test data']);
        
    }

    public function test_accept_room_with_another_status() {

    }

    public function test_cancel() {
        $room_rent = RoomRent::factory()->create();
        $delete_room_rent = $this->room_rent_repository->delete($room_rent->id);
        $this->assertTrue($delete_room_rent);
        $this->assertDatabaseMissing('room_rents', $room_rent->toArray());
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            RoomRent::where('renter_id', $renter_id)->delete();
            User::where('id', $renter_id)->delete();
        }
        Room::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
