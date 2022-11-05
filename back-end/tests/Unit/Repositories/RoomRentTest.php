<?php

namespace Tests\Unit\Repositories;

use App\Models\RoomRent;
use App\Models\Room;
use App\Models\RoomRentRegistration;
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
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id,'room_id' => $room->id]);
        $found_room_rent = $this->room_rent_repository->show($room_rent->id);
        $this->assertInstanceOf(RoomRent::class, $found_room_rent);
        $this->assertEquals($found_room_rent->renter_id, $room_rent->renter_id);
        $this->assertEquals($found_room_rent->room_id, $room_rent->room_id);
    }

    public function test_accept_room_rent_with_admin_role() {
        $room = Room::factory()->create(['status' => Room::STATUS_FULL, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'occupation' => 'test data']);
        $intent_room_rent = RoomRent::factory()->create(['renter_id' => $admin->id, 'room_id' => $room->id]);
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertFalse($is_accepted);
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
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
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
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $previous_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        RoomRent::factory()->create(['renter_id' => $previous_renter->id, 'room_id' => $room->id]);
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_FEMALE_ID]);
        $intent_room_rent = array();
        $intent_room_rent['renter_id'] = $renter->id;
        $intent_room_rent['room_id'] = $room->id;
        //$room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $is_accepted = $this->room_rent_repository->accept($intent_room_rent);
        $this->assertFalse($is_accepted); //_\\//_\\
    }

    public function test_check_gender_with_existed_room_rent() {
        $partner = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        $male_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        $female_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_FEMALE_ID]);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $partner->id, 'room_id' => $room->id]);
        $this->assertTrue($this->room_rent_repository->checkGender($room->id, $male_renter->gender)); //_\\//_\\
        $this->assertFalse($this->room_rent_repository->checkGender($room->id, $female_renter->gender));
    }

    public function test_check_gender_with_existed_room_rent_registration_request() {
        $sender = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        $male_sender = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_MALE_ID]);
        $female_sender = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data', 'gender' => User::GENDER_FEMALE_ID]);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent_registration_request = RoomRentRegistration::factory()->create(['registered_room_id' => $room->id, 'sender_gender' => $sender->gender]);
        $this->assertTrue($this->room_rent_repository->checkGender($room->id, $male_sender->gender)); //_\\//_\\
        $this->assertFalse($this->room_rent_repository->checkGender($room->id, $female_sender->gender));
    }

    public function test_cancel() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_OCCUPIED, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $delete_room_rent = $this->room_rent_repository->cancel($room_rent->id);
        $this->assertTrue($delete_room_rent);
        $this->assertDatabaseMissing('room_rents', $room_rent->toArray());
    }

    public function test_check_rent_room() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $this->assertTrue($this->room_rent_repository->checkRentRoom($renter->id));
    }

    public function test_get_room_of_renter() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $renter_room = $this->room_rent_repository->getRenterRoom($renter->id);
        $this->assertEquals($renter_room->id, $room->id);
    }

    public function test_get_current_room_partners_of_renter() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $renter_partner = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $room = Room::factory()->create(['status' => Room::STATUS_EMPTY, 'description' => 'test data', 'category_id' => $this->room_category['id']]);
        $first_room_rent = RoomRent::factory()->create(['renter_id' => $renter->id, 'room_id' => $room->id]);
        $second_room_rent = RoomRent::factory()->create(['renter_id' => $renter_partner->id, 'room_id' => $room->id]);
        $this->assertEquals(count($this->room_rent_repository->getRenterCurrentRoomPartners($renter->id)), 1);
    }

    public function tearDown() : void
    {
        $all_rooms_id = Room::where('description', 'test data')->pluck('id');
        foreach($all_rooms_id as $room_id) {
            RoomRentRegistration::where('registered_room_id', $room_id)->delete();
        }
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
