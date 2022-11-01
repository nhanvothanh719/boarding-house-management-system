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
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); //role renter
        $breach = Breach::factory()->create(['description' => 'test data']);
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
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); //role renter
        $breach = Breach::factory()->create(['description' => 'test data']);
        $breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id]);
        $found_breach_history = $this->breach_history_repository->show($breach_history->id);
        $this->assertInstanceOf(BreachHistory::class, $found_breach_history);
        $this->assertEquals($found_breach_history->renter_id, $breach_history->renter_id);
        $this->assertEquals($found_breach_history->breach_id, $breach_history->breach_id);
        $this->assertEquals($found_breach_history->violated_at, $breach_history->violated_at);
    }

    public function test_delete() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); //role renter
        $breach = Breach::factory()->create(['description' => 'test data']);
        $breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id]);
        $delete_breach_history = $this->breach_history_repository->delete($breach_history->id);
        $this->assertTrue($delete_breach_history);
        $this->assertDatabaseMissing('breach_histories', $breach_history->toArray());
    }

    public function test_get_renter_breach_histories() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']); //role renter
        $breach = Breach::factory()->create(['description' => 'test data']);
        $all_breach_histories = array();
        $first_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s', strtotime(' -1 hours'))]);
        array_push($all_breach_histories, $first_breach_history);
        $second_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s')]);
        array_push($all_breach_histories, $second_breach_history);
        $renter_breach_histories = $this->breach_history_repository->getRenterBreachHistories($renter->id, $breach->id);
        $this->assertSameSize($renter_breach_histories, $all_breach_histories);
    }

    public function test_calculate_breach_remain_allowed_number() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $breach = Breach::factory()->create(['description' => 'test data', 'allowed_violate_number' => 3]);
        $first_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s', strtotime(' -1 hours'))]);
        $second_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s')]);
        $remain_allowed_number = $breach->allowed_violate_number - 2;
        $this->assertEquals($remain_allowed_number, $this->breach_history_repository->calculateBreachRemainAllowedNumber($renter->id, $breach->id));
    }

    public function test_check_admin_role() {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'occupation' => 'test data']);
        $this->assertTrue($this->breach_history_repository->checkAdminRole($admin->id));
    }

    public function test_lock_user_account() {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'occupation' => 'test data']);
        $this->assertFalse($this->breach_history_repository->lockUserAccount($admin->id));
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->assertTrue($this->breach_history_repository->lockUserAccount($renter->id));
    }

    public function test_get_histories_of_breaches() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $breach = Breach::factory()->create(['description' => 'test data', 'allowed_violate_number' => 3]);
        $first_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s', strtotime(' -1 hours'))]);
        $second_breach_history = BreachHistory::factory()->create(['renter_id' => $renter->id, 'breach_id' => $breach->id, 'violated_at' => date('Y-m-d H:i:s')]);
        $this->assertEquals(count($this->breach_history_repository->getRenterBreachHistories($renter->id, $breach->id)), 2);
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            BreachHistory::where('renter_id', $renter_id)->delete();
            User::where('id', $renter_id)->delete();
        }
        Breach::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
