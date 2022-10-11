<?php

namespace Tests\Unit\Repositories;

use App\Models\BreachHistory;
use App\Models\Breach;
use App\Models\User;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\BreachHistory\BreachHistoryRepository;
use App\Repositories\User\UserRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BreachHistoryTest extends TestCase
{
    protected $breach_history;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => 1]); //role renter
        $breach = Breach::factory()->create();
        $this->breach_history = [
            'renter_id' => $renter->id,
            'breach_id' => $breach->id,
            'violated_at' => date('Y-m-d H:i:s'),
        ];
        $this->breach_history_repository = new BreachHistoryRepository(new UserRepository);
    }

    public function test_all() {
        $all_breach_histories = $this->breach_history_repository->all();
        $this->assertDatabaseCount('breach_histories', count($all_breach_histories));
    }

    public function test_store() {
        $breach_history = $this->breach_history_repository->store($this->breach_history);
        $this->assertInstanceOf(BreachHistory::class, $breach_history);
        $this->assertDatabaseHas('breach_histories', $this->breach_history);
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => 1]); //role renter
        $breach = Breach::factory()->create();
        $breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id]);
        $found_breach_history = $this->breach_history_repository->show($breach_history->id);
        $this->assertInstanceOf(BreachHistory::class, $found_breach_history);
        $this->assertEquals($found_breach_history->renter_id, $breach_history->renter_id);
        $this->assertEquals($found_breach_history->breach_id, $breach_history->breach_id);
        $this->assertEquals($found_breach_history->violated_at, $breach_history->violated_at);
    }

    public function test_delete() {
        $renter = User::factory()->create(['role' => 1]); //role renter
        $breach = Breach::factory()->create();
        $breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id]);
        $delete_breach_history = $this->breach_history_repository->delete($breach_history->id);
        $this->assertTrue($delete_breach_history);
        $this->assertDatabaseMissing('breach_histories', $breach_history->toArray());
    }
}
