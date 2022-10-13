<?php

namespace Tests\Unit\Repositories;

use App\Models\RoomContract;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\RoomContract\RoomContractRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

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
            $this->room_contract, 
            $this->room_contract['owner_signature'], 
            $this->room_contract['renter_signature']);
        $directory = 'app/public/'.RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$this->room_contract['renter_id'];
        $this->assertInstanceOf(RoomContract::class, $room_contract);

        //$this->assertDatabaseHas('room_contracts', $this->room_contract);
        //$this->assertFileExists($directory.$this->room_contract['owner_signature']); 
        //$this->assertFileExists($directory.$this->room_contract['renter_signature']);
    }

    public function test_show() {
        $room_contract = RoomContract::factory()->create(['renter_id' => $this->room_contract['renter_id']]);
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
        $room_contract = RoomContract::factory()->create([
            'renter_id' => $this->room_contract['renter_id'],
            'owner_signature' => $this->room_contract['owner_signature'],
            'renter_signature' => $this->room_contract['renter_signature'],
            'effective_from' => $this->room_contract['effective_from'],
            'effective_until' => date('Y-m-d', strtotime(' +55 year')),
        ]);
        $new_room_contract = $this->room_contract_repository->update($this->room_contract, $room_contract->id);
        //Test if the database is updated
        $this->assertDatabaseHas('room_contracts', $this->room_contract);

        //$this->assertInstanceOf(RoomContract::class, $new_room_contract);
        //$this->assertEquals($new_room_contract->deposit_amount, $this->room_contract['deposit_amount']);
        //$this->assertEquals($new_room_contract->effective_until, $this->room_contract['effective_until']);
    }

    public function test_delete() {
        $room_contract = RoomContract::factory()->create(['renter_id' => $this->room_contract['renter_id']]);
        $delete_contract = $this->room_contract_repository->delete($room_contract->id);
        $this->assertTrue($delete_contract);
        $this->assertDatabaseMissing('room_contracts', $room_contract->toArray());
    }

    public function test_update_signatures() {
        $room_contract = RoomContract::factory()->create([
            'renter_id' => $this->room_contract['renter_id'],
            'deposit_amount' => $this->room_contract['deposit_amount'],
            'owner_signature' => UploadedFile::fake()->image('old_owner_sig.jpg'),
            'renter_signature' => UploadedFile::fake()->image('old_renter_sig.jpg'),
            'effective_from' => $this->room_contract['effective_from'],
            'effective_until' => $this->room_contract['effective_until'],
        ]);
        $new_room_contract = $this->room_contract_repository->updateSignatures($room_contract->id, $this->room_contract['owner_signature'], $this->room_contract['renter_signature']);
        $this->assertInstanceOf(RoomContract::class, $new_room_contract);

        //Test if the database is updated
        //$this->assertDatabaseHas('room_contracts', $this->room_contract);
        //$this->assertEquals($new_room_contract->owner_signature, $this->room_contract['owner_signature']);
        //$this->assertEquals($new_room_contract->renter_signature, $this->room_contract['renter_signature']);
        //$directory = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$this->room_contract['renter_id'].'/';
        //$this->assertFileExists($directory.$this->room_contract['owner_signature']); 
        //$this->assertFileExists($directory.$this->room_contract['renter_signature']);
    }

    public function tearDown() : void
    {
        RoomContract::whereYear('effective_until', date('Y', strtotime(' +50 year')))->delete();
        User::whereYear('date_of_birth', date('Y', strtotime(' -18 year')))->delete();
        parent::tearDown();
    }
}
