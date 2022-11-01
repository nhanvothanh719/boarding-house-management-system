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
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        //Make punctual payment
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $this->payment_history = [
            'invoice_id' => $invoice->id,
            'payment_id' => $this->faker->unique()->isbn10(),
            'made_by' => $renter->id,
            'made_at' => date('Y-m-d H:i:s'),
            'payment_method' => PaymentHistory::PAYMENT_METHOD_CASH,
        ];
        $this->payment_history_repository = new PaymentHistoryRepository(
            new InvoiceRepository(new InvoiceDetailRepository()), 
            new BalanceRepository());
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $payment_history = PaymentHistory::factory()->create(['invoice_id' => $invoice->id, 'made_by' => $renter->id]);
        $found_payment_history = $this->payment_history_repository->show($payment_history->id);
        $this->assertInstanceOf(PaymentHistory::class, $found_payment_history);
        $this->assertEquals($found_payment_history->invoice_id, $payment_history->invoice_id);
        $this->assertEquals($found_payment_history->payment_id, $payment_history->payment_id);
        $this->assertEquals($found_payment_history->made_by, $payment_history->made_by);
        $this->assertEquals($found_payment_history->made_at, $payment_history->made_at);
    }

    public function test_store_punctual_payment_by_cash() {
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['payment_method'] = PaymentHistory::PAYMENT_METHOD_CASH;
        $is_stored = $this->payment_history_repository->store($test_data, $test_data['invoice_id']);
        $this->assertTrue($is_stored);
    }

    public function test_store_punctual_payment_by_paypal() {
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['payment_method'] = PaymentHistory::PAYMENT_METHOD_PAYPAL;
        $is_stored = $this->payment_history_repository->store($test_data, $test_data['invoice_id']);
        $this->assertTrue($is_stored);
    }

    public function test_store_punctual_payment_by_razorpay() {
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['payment_method'] = PaymentHistory::PAYMENT_METHOD_RAZORPAY;
        $is_stored = $this->payment_history_repository->store($test_data, $test_data['invoice_id']);
        $this->assertTrue($is_stored);
    }

    public function test_store_payment_for_overdue_invoice() {
        $overdue_invoice = Invoice::factory()->create(['renter_id' => $this->payment_history['made_by'], 'valid_until' => date('Y-m-d', strtotime(' -PaymentHistory::PAYMENT_METHOD_CASH0 day'))]);
        $test_data = array();
        $test_data = $this->payment_history;
        $test_data['invoice_id'] = $overdue_invoice->id;
        $test_data['payment_method'] = PaymentHistory::PAYMENT_METHOD_CASH;
        $is_stored = $this->payment_history_repository->store($test_data, $overdue_invoice->id);
        $this->assertFalse($is_stored);
    }

    public function test_get_paid_invoices_rate() {
        //Delete existed invoices and payment histories
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            PaymentHistory::where('made_by', $renter_id)->delete();
            Invoice::where('renter_id', $renter_id)->delete();
        }
        User::where('occupation', 'test data')->delete();
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $first_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $second_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $third_invoice = Invoice::factory()->create(['renter_id' => $second_renter->id]);
        $fourth_invoice = Invoice::factory()->create(['renter_id' => $second_renter->id]);
        $fifth_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $first_payment_history = PaymentHistory::factory()->create(['invoice_id' => $first_invoice->id, 'made_by' => $first_renter->id]);
        $second_payment_history = PaymentHistory::factory()->create(['invoice_id' => $second_invoice->id, 'made_by' => $first_renter->id]);
        $third_payment_history = PaymentHistory::factory()->create(['invoice_id' => $third_invoice->id, 'made_by' => $second_renter->id]);
        $fourth_payment_history = PaymentHistory::factory()->create(['invoice_id' => $fourth_invoice->id, 'made_by' => $second_renter->id]);
        $paid_invoices_rate = round(4 / 5 * 100);
        $this->assertEquals($this->payment_history_repository->getPaidInvoicesRate(), $paid_invoices_rate);
    }

    public function test_count_paid_methods() {
        //Delete existed invoices and payment histories
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            PaymentHistory::where('made_by', $renter_id)->delete();
            Invoice::where('renter_id', $renter_id)->delete();
        }
        $first_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $second_renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $first_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $second_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $third_invoice = Invoice::factory()->create(['renter_id' => $second_renter->id]);
        $fourth_invoice = Invoice::factory()->create(['renter_id' => $second_renter->id]);
        $fifth_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $sixth_invoice = Invoice::factory()->create(['renter_id' => $first_renter->id]);
        $first_payment_history = PaymentHistory::factory()->create(['invoice_id' => $first_invoice->id, 'made_by' => $first_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_RAZORPAY]);
        $second_payment_history = PaymentHistory::factory()->create(['invoice_id' => $second_invoice->id, 'made_by' => $first_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_CASH]);
        $third_payment_history = PaymentHistory::factory()->create(['invoice_id' => $third_invoice->id, 'made_by' => $second_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_PAYPAL]);
        $fourth_payment_history = PaymentHistory::factory()->create(['invoice_id' => $fourth_invoice->id, 'made_by' => $second_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_RAZORPAY]);
        $fifth_payment_history = PaymentHistory::factory()->create(['invoice_id' => $fifth_invoice->id, 'made_by' => $first_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_PAYPAL]);
        $sixth_payment_history = PaymentHistory::factory()->create(['invoice_id' => $sixth_invoice->id, 'made_by' => $first_renter->id, 'payment_method' => PaymentHistory::PAYMENT_METHOD_PAYPAL]);
        $paid_methods_count = $this->payment_history_repository->countPaidMethods();
        $this->assertEquals($paid_methods_count[0]->method_name, "Paypal");
        $this->assertEquals($paid_methods_count[0]->total, 3);
        $this->assertEquals($paid_methods_count[1]->method_name, "Razorpay");
        $this->assertEquals($paid_methods_count[1]->total, 2);
        $this->assertEquals($paid_methods_count[2]->method_name, "Cash");
        $this->assertEquals($paid_methods_count[2]->total, 1);
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            PaymentHistory::where('made_by', $renter_id)->delete();
            Invoice::where('renter_id', $renter_id)->delete();
        }
        User::where('occupation', 'test data')->delete();
        parent::tearDown();
    }
}
