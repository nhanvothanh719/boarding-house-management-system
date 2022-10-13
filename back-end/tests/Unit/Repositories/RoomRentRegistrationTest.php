<?php

namespace Tests\Unit\Repositories;

use App\Models\Room;
use App\Models\User;
use App\Models\Category;
use App\Models\RoomRentRegistration;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\Room\RoomRepository;
use App\Repositories\RoomRentRegistration\RoomRentRegistrationRepository;
use App\Repositories\RoomImage\RoomImageRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomRentRegistrationTest extends TestCase
{
    protected $room_rent_registration;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        $category = Category::factory()->create(['description' => 'test data']);
        $room = Room::factory()->create(['description' => 'test data', 'category_id' => $category->id]);
        // Prepare data for test
        $this->room_rent_registration = [
            'sender_name' => $this->faker->name(),
            'sender_gender' => rand(0, 1),
            'sender_email' => $this->faker->safeEmail(),
            'sender_phone_number' => $this->faker->unique()->numerify('096#######'),
            'registered_room_id' => $room->id,
            'is_accepted' => RoomRentRegistration::STATUS_NOT_ACCEPTED,
        ];
        $this->room_rent_registration_repository = new RoomRentRegistrationRepository(new RoomRepository(new RoomImageRepository()));
    }

    public function test_all() {
        $all_room_rent_registrations = $this->room_rent_registration_repository->all();
        $this->assertDatabaseCount('room_rent_registrations', count($all_room_rent_registrations));
    }

    public function test_store() {
        $room_rent_registration = $this->room_rent_registration_repository->store($this->room_rent_registration);
        $this->assertInstanceOf(RoomRentRegistration::class, $room_rent_registration);
        $this->assertDatabaseHas('room_rent_registrations', $this->room_rent_registration);
    }

    public function test_show() {
        $room_rent_registration = RoomRentRegistration::factory()->create(['registered_room_id' => $this->room_rent_registration['registered_room_id']]);
        $found_room_rent_registration = $this->room_rent_registration_repository->show($room_rent_registration->id);
        $this->assertInstanceOf(RoomRentRegistration::class, $found_room_rent_registration);
        $this->assertEquals($found_room_rent_registration->sender_name, $room_rent_registration->sender_name);
        $this->assertEquals($found_room_rent_registration->sender_gender, $room_rent_registration->sender_gender);
        $this->assertEquals($found_room_rent_registration->sender_email, $room_rent_registration->sender_email);
        $this->assertEquals($found_room_rent_registration->sender_phone_number, $room_rent_registration->sender_phone_number);
        $this->assertEquals($found_room_rent_registration->is_accepted, $room_rent_registration->is_accepted);
    }

    public function test_delete() {
        $room_rent_registration = RoomRentRegistration::factory()->create(['registered_room_id' => $this->room_rent_registration['registered_room_id']]);
        $delete_room_rent_registration = $this->room_rent_registration_repository->delete($room_rent_registration->id);
        $this->assertTrue($delete_room_rent_registration);
        $this->assertDatabaseMissing('room_rent_registrations', $room_rent_registration->toArray());
    }

    public function tearDown() : void
    {
        $categories_id = Category::where('description', 'test data')->pluck('id');
        foreach($categories_id as $category_id) {
           $rooms_id = Room::where('category_id', $category_id)->pluck('id');
           foreach($rooms_id as $room_id) {
            RoomRentRegistration::where('registered_room_id', $room_id)->delete();
            Room::where('id', $room_id)->delete();
           }
        }
        Category::where('description', 'test_data')->delete();
        parent::tearDown();
    }
}
