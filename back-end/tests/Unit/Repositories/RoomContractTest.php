<?php

namespace Tests\Unit\Repositories;

use App\Models\RoomContract;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\RoomContract\RoomContractRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadFile;
use Illuminate\Support\Facades\Storage;

class RoomContractTest extends TestCase
{
    protected $room_contract;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => 1]);
        $this->room_contract = [
            'renter_id' => $renter->id,
            'effective_from' => date('Y-m-d'),
            'effective_until' => date('Y-m-d', strtotime(' +50 year')),
            'deposit_amount' => rand(100, 500),
            'owner_signature' => UploadedFile::fake()->image('owner_sig.jpg'),
            'renter_signature' => UploadedFile::fake()->image('renter_sig.jpg'),
        ];
        $this->room_contract_repository = new RoomContractRepository();
    }

    public function test_all() {
        $all_room_contracts = $this->room_contract_repository->all();
        $this->assertDatabaseCount('room_contracts', count($all_room_contracts));
    }

    public function test_store() {
        $room_contract = $this->room_contract_repository->store(
            $this->contract, 
            $this->contract['owner_signature'], $this->contract['renter_signature']);
        $directory = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$this->contract['renter_id'].'/';
        $this->assertInstanceOf(RoomContract::class, $room_contract);
        $this->assertDatabaseHas('room_contracts', $this->contract);
        $this->assertFileExists($directory.$this->contract(['owner_signature'])); 
        $this->assertFileExists($directory.$this->contract(['renter_signature']));
    }

    public function test_show() {
        $room_contract = RoomContract::factory()->create(['renter_id' => $this->contract['renter_id']]);
        $found_room_contract = $this->room_contract_repository->show($room_contract->id);
        $this->assertInstanceOf(RoomContract::class, $found_room_contract);
        $this->assertEquals($found_room_contract->renter_id, $room_contract->renter_id);
        $this->assertEquals($found_room_contract->effective_from, $room_contract->effective_from);
        $this->assertEquals($found_room_contract->effective_until, $room_contract->effective_until);
        $this->assertEquals($found_room_contract->deposit_amount, $room_contract->deposit_amount);
        $this->assertEquals($found_room_contract->owner_signature, $room_contract->owner_signature);
        $this->assertEquals($found_room_contract->renter_signature, $room_contract->renter_signature);
    }

    public function test_update() {
        $room_contract = RoomContract::factory()->create();
        $new_contract = $this->room_contract_repository->update($this->contract, $room_contract->id);
        $this->assertInstanceOf(RoomContract::class, $new_contract);
        $this->assertEquals($new_contract->name, $this->contract['name']);
        $this->assertEquals($new_contract->description, $this->contract['description']);
        $this->assertEquals($new_contract->severity_level, $this->contract['severity_level']);
        $this->assertEquals($new_contract->allowed_violate_number, $this->contract['allowed_violate_number']);
        //Test if the database is updated
        $this->assertDatabaseHas('room_contracts', $this->contract);
    }

    public function test_delete() {
        $room_contract = RoomContract::factory()->create();
        $delete_contract = $this->room_contract_repository->delete($room_contract->id);
        $this->assertTrue($delete_contract);
        $this->assertDatabaseMissing('room_contracts', $room_contract->toArray());
    }

    public function tearDown()
    {
        RoomContract::whereYear('effective_until', date('Y', strtotime(' +50 year')))->delete();
        User::whereYear('date_of_birth', date('Y', strtotime(' -18 year')))->delete();
        parent::tearDown();
    }
}
