<?php

namespace Tests\Unit\Repositories;

use App\Models\PaymentHistory;
use App\Models\Invoice;
use App\Models\User;

use Tests\TestCase;

use Faker\Factory as Faker;

use App\Repositories\PaymentHistory\PaymentHistoryRepository;
use App\Repositories\Invoice\InvoiceRepository;
use App\Repositories\InvoiceDetail\InvoiceDetailRepository;
use App\Repositories\Balance\BalanceRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentHistoryTest extends TestCase
{
    protected $payment_history;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create();
        //Make punctual payment
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $this->payment_history = [
            'invoice_id' => $invoice->id,
            'payment_id' => $this->faker->unique()->isbn10(),
            'made_by' => $renter->id,
            'made_at' => date('Y-m-d H:i:s'),
            'payment_method' => 1,
        ];
        $this->payment_history_repository = new PaymentHistoryRepository(
            new InvoiceRepository(new InvoiceDetailRepository()), 
            new BalanceRepository());
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => 1]);
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $payment_history = PaymentHistory::factory()->create(['invoice_id' => $invoice->id, 'made_by' => $renter->id]);
        $found_payment_history = $this->payment_history_repository->show($payment_history->id);
        $this->assertInstanceOf(PaymentHistory::class, $found_payment_history);
        $this->assertEquals($found_payment_history->invoice_id, $payment_history->invoice_id);
        $this->assertEquals($found_payment_history->payment_id, $payment_history->payment_id);
        $this->assertEquals($found_payment_history->made_by, $payment_history->made_by);
        $this->assertEquals($found_payment_history->made_at, $payment_history->made_at);
    }

    public function test_store_punctual_payment() {
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['payment_method'] = 1;
        $is_stored = $this->payment_history_repository->store($test_data, $test_data['invoice_id']);
        $this->assertTrue($is_stored);
    }

    public function test_store_payment_for_overdue_invoice() {
        $overdue_invoice = Invoice::factory()->create(['renter_id' => $this->payment_history['made_by'], 'valid_until' => date('Y-m-d', strtotime(' -10 day'))]);
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['invoice_id'] = $overdue_invoice->id;
        $test_data['payment_method'] = 1;
        $is_stored = $this->payment_history_repository->store($test_data, $overdue_invoice->id);
        $this->assertFalse($is_stored);
    }
}
