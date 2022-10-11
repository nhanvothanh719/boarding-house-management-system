<?php

namespace Tests\Unit\Repositories;

use App\Models\Balance;
use App\Models\User;
use App\Models\Invoice;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\Balance\BalanceRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BalanceTest extends TestCase
{
    protected $balance_change;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $this->balance_change = [
            'description' => $this->faker->paragraph,
            'is_income' => rand(0, 1),
            'amount' => $this->faker->randomDigit,
            'occurred_on' => date('Y-m-d'),
        ];
        $this->balance_repository = new BalanceRepository();
    }

    public function test_all() {
        $all_balance_changes = $this->balance_repository->all();
        $this->assertDatabaseCount('balance', count($all_balance_changes));
    }

    public function test_store() {
        $balance_change = $this->balance_repository->store($this->balance_change);
        $this->assertInstanceOf(Balance::class, $balance_change);
        $this->assertDatabaseHas('balance', $this->balance_change);
    }

    public function test_show() {
        $balance_change = Balance::factory()->create();
        $found_balance_change = $this->balance_repository->show($balance_change->id);
        $this->assertInstanceOf(Balance::class, $found_balance_change);
        $this->assertEquals($found_balance_change->description, $balance_change->description);
        $this->assertEquals($found_balance_change->is_income, $balance_change->is_income);
        $this->assertEquals($found_balance_change->amount, $balance_change->amount);
        $this->assertEquals($found_balance_change->occurred_on, $balance_change->occurred_on);
    }

    public function test_update() {
        $balance_change = Balance::factory()->create();
        $new_balance_change = $this->balance_repository->update($this->balance_change, $balance_change->id);
        $this->assertInstanceOf(Balance::class, $new_balance_change);
        $this->assertEquals($new_balance_change->description, $this->balance_change['description']);
        $this->assertEquals($new_balance_change->amount, $this->balance_change['amount']);
        $this->assertEquals($new_balance_change->occurred_on, $this->balance_change['occurred_on']);
        //Test if the database is updated
        $this->assertDatabaseHas('balance', $new_balance_change->toArray());
    }

    public function test_delete() {
        $balance_change = Balance::factory()->create();
        $delete_balance_change = $this->balance_repository->delete($balance_change->id);
        $this->assertTrue($delete_balance_change);
        $this->assertDatabaseMissing('balance', $balance_change->toArray());
    }

    public function test_handle_after_payment() {
        $renter = User::factory()->create(['role' => 1]); //role renter
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $balance_change = $this->balance_repository->handleAfterPayment($invoice, 1);
        $this->assertInstanceOf(Balance::class, $balance_change);
        $this->assertDatabaseHas('balance', $balance_change->toArray());
    }
}
