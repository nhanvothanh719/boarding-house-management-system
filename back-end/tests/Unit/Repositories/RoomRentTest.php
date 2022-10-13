<?php

namespace Tests\Unit\Repositories;

use App\Models\RoomRent;
use App\Models\Room;
use App\Models\Category;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\RoomRent\RoomRentRepository;
use App\Repositories\Room\RoomRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\RoomImage\RoomImageRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomRentTest extends TestCase
{
    protected $room_rent;
    protected $room_category;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->room_category = Category::factory()->create(['description' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $this->room_rent = [
            'renter_id' => $renter->id,
            'room_id' => $room->id,
        ];
        $this->room_rent_repository = new RoomRentRepository(new RoomRepository(new RoomImageRepository()), new UserRepository());
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
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id,'room_id' => $room->id,]);
        $found_room_rent = $this->room_rent_repository->show($room_rent->id);
        $this->assertInstanceOf(RoomRent::class, $found_room_rent);
        $this->assertEquals($found_room_rent->renter_id, $room_rent->renter_id);
        $this->assertEquals($found_room_rent->room_id, $room_rent->room_id);
    }
    
    public function test_accept_room_rent_when_room_is_full() {
        $room = Room::factory()->create(['status' => Room::STATUS_FULL, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $intent_room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertFalse($is_accepted);
    }

    public function test_accept_room_rent_when_room_is_empty() {
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $intent_room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertTrue($is_accepted);
    }

    public function test_accept_room_rent_with_same_gender_partner() {
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $previous_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        RoomRent::factory()->create(['renter_id' => $previous_renter->id, 'room_id' => $room->id]);
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        $intent_room_rent = array();
        $intent_room_rent['renter_id'] = $renter->id;
        $intent_room_rent['room_id'] = $room->id;
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertTrue($is_accepted);
    }

    public function test_accept_room_rent_with_different_gender_partner() {
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $previous_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        RoomRent::factory()->create(['renter_id' => $previous_renter->id, 'room_id' => $room->id]);
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_FEMALE_ID]);
        $intent_room_rent = array();
        $intent_room_rent['renter_id'] = $renter->id;
        $intent_room_rent['room_id'] = $room->id;
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertFalse($is_accepted);
    }


    public function test_cancel() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $delete_room_rent = $this->room_rent_repository->cancel($room_rent->id);
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
        Category::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
