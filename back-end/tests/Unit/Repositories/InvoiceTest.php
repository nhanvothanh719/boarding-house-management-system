<?php

namespace Tests\Unit\Repositories;

use App\Models\Invoice;
use App\Models\User;
use App\Models\InvoiceDetail;
use App\Models\Service;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\Invoice\InvoiceRepository;
use App\Repositories\InvoiceDetail\InvoiceDetailRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InvoiceTest extends TestCase
{
    protected $invoice;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->invoice = [
            'renter_id' => $renter->id,
            'discount' => rand(1, 50),
            'extra_fee' => rand(0, 90),
            'extra_fee_description' => $this->faker->paragraph,
            'total' => rand(10, 100),
            'month' => rand(1, 12),
            'year' => 2022,
            'effective_from' => date('Y-m-d'),
            'valid_until' => date("Y-m-d", strtotime(date('Y-m-d')."+15 day")),
        ];
        $this->invoice_repository = new InvoiceRepository(new InvoiceDetailRepository());
    }

    public function test_all() {
        $all_invoices = $this->invoice_repository->all();
        $this->assertDatabaseCount('invoices', count($all_invoices));
    }

    public function test_store() {
        $test_invoice = $this->invoice;
        $invoice_services = array();
        $test_invoice['services'] = $invoice_services;
        $invoice = $this->invoice_repository->store($test_invoice, $this->invoice['renter_id']);
        $this->assertInstanceOf(Invoice::class, $invoice);
    }

    public function test_show() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $found_invoice = $this->invoice_repository->show($invoice->id);
        $this->assertInstanceOf(Invoice::class, $found_invoice);
        $this->assertEquals($found_invoice->renter_id, $invoice->renter_id);
        $this->assertEquals($found_invoice->discount, $invoice->discount);
        $this->assertEquals($found_invoice->extra_fee, $invoice->extra_fee);
        $this->assertEquals($found_invoice->extra_fee_description, $invoice->extra_fee_description);
        $this->assertEquals($found_invoice->total, $invoice->total);
        $this->assertEquals($found_invoice->month, $invoice->month);
        $this->assertEquals($found_invoice->year, $invoice->year);
        $this->assertEquals($found_invoice->effective_from, $invoice->effective_from);
        $this->assertEquals($found_invoice->valid_until, $invoice->valid_until);
    }

    public function test_update() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $new_invoice = $this->invoice_repository->update($this->invoice, $invoice->id);
        $this->assertInstanceOf(Invoice::class, $new_invoice);
        $this->assertEquals($new_invoice->effective_from, $this->invoice['effective_from']);
        $this->assertEquals($new_invoice->valid_until, $this->invoice['valid_until']);
    }

    public function test_delete() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $delete_invoice = $this->invoice_repository->delete($invoice->id);
        $this->assertTrue($delete_invoice);
        $this->assertDatabaseMissing('invoices', $invoice->toArray());
    }

    public function test_is_created() {
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $month_jan = 1;
        $month_feb = 2;
        $invoice = Invoice::factory()->create(['renter_id' => $renter->id, 'month' => $month_jan]);
        $this->assertFalse($this->invoice_repository->checkCreated($renter->id, $month_feb));
        $this->assertTrue($this->invoice_repository->checkCreated($renter->id, $month_jan));
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            Invoice::where('renter_id', $renter_id)->delete();
        }
        User::where('occupation', 'test data')->delete();
        parent::tearDown();
    }
}
