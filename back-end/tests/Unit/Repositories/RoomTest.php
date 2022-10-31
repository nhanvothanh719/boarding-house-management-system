<?php

namespace Tests\Unit\Repositories;

use App\Models\Room;
use App\Models\Category;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\Room\RoomRepository;
use App\Repositories\RoomImage\RoomImageRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class RoomTest extends TestCase
{
    protected $room;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        $category = Category::factory()->create(['description' => 'test data']);
        // Prepare data for test
        $this->room = [
            'number' => $this->faker->unique()->numerify('###'),
            'area' => rand(200, 400),
            'category_id' => $category->id,
            'description' => 'test data',
            'status' => Room::STATUS_EMPTY,
            'has_conditioner' => rand(0, 1),
            'has_fridge' => rand(0, 1),
            'has_wardrobe' => rand(0, 1),
        ];
        $this->room_repository = new RoomRepository(new RoomImageRepository());
    }

    public function test_all() {
        $all_rooms = $this->room_repository->all();
        $this->assertDatabaseCount('rooms', count($all_rooms));
    }

    public function test_store() {
        $test_room = $this->room;
        $test_room['image'] = null;
        $room = $this->room_repository->store($test_room);
        $this->assertInstanceOf(Room::class, $room);
        $this->assertEquals($room->status, Room::STATUS_EMPTY);
    }

    public function test_show() {
        $room = Room::factory()->create(['category_id' => $this->room['category_id'], 'description' => 'test data']);
        $found_room = $this->room_repository->show($room->id);
        $this->assertInstanceOf(Room::class, $found_room);
        $this->assertEquals($found_room->number, $room->number);
        $this->assertEquals($found_room->status, $room->status);
        $this->assertEquals($found_room->has_conditioner, $room->has_conditioner);
        $this->assertEquals($found_room->has_fridge, $room->has_fridge);
        $this->assertEquals($found_room->has_wardrobe, $room->has_wardrobe);
    }

    public function test_update() {
        $test_room = $this->room;
        $test_room['image'] = null;
        $room = Room::factory()->create([
            'category_id' => $this->room['category_id'], 
            'description' => 'test data',
            'status' => $this->room['status'],
        ]);
        $new_room = $this->room_repository->update($test_room, $room->id);
        $this->assertInstanceOf(Room::class, $new_room);
        $this->assertEquals($new_room->number, $this->room['number']);
        $this->assertEquals($new_room->has_fridge, $this->room['has_fridge']);
        $this->assertEquals($new_room->has_wardrobe, $this->room['has_wardrobe']);
        $this->assertEquals($new_room->has_conditioner, $this->room['has_conditioner']);
        $this->assertDatabaseHas('rooms', $this->room);
    }

    public function test_delete() {
        $room = Room::factory()->create(['category_id' => $this->room['category_id'], 'description' => 'test data']);
        $delete_room = $this->room_repository->delete($room->id);
        $this->assertTrue($delete_room);
        $this->assertDatabaseMissing('rooms', $room->toArray());
    }

    public function test_room_count() {
        $this->assertDatabaseCount('rooms', $this->room_repository->countRooms());
    }

    public function test_check_used() {
        $empty_room = Room::factory()->create(['category_id' => $this->room['category_id'], 'description' => 'test data', 'status' => Room::STATUS_EMPTY]);
        $this->assertFalse($this->room_repository->checkUsed($empty_room->id));
        $full_room = Room::factory()->create(['category_id' => $this->room['category_id'], 'description' => 'test data', 'status' => Room::STATUS_FULL]);
        $this->assertTrue($this->room_repository->checkUsed($full_room->id));

    }

    public function tearDown() : void
    {
        Room::where('description', 'test data')->delete();
        Category::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
