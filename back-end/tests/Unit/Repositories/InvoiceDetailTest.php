<?php

namespace Tests\Unit\Repositories;

use App\Models\InvoiceDetail;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\User;

use Tests\TestCase;

use \stdClass;

use Faker\Factory as Faker;

use App\Repositories\InvoiceDetail\InvoiceDetailRepository;

use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InvoiceDetailTest extends TestCase
{
    protected $invoice_detail;

    public function setUp() : void {
        parent::setUp();
        $this->faker = Faker::create();
        // Prepare data for test
        $renter = User::factory()->create(['role' => User::ROLE_RENTER, 'occupation' => 'test data']);
        $this->invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $this->service = Service::factory()->create(['description' => 'test data']);
        $this->invoice_detail = [
            'invoice_id' => $this->invoice->id,
            'service_id' => $this->service->id,
            'quantity' => 2,
            'subtotal' => 2 * $this->service->unit_price,
        ];
        $this->invoice_detail_repository = new InvoiceDetailRepository();
    }

    public function test_store() {
        $services = array();
        $service = $this->service;
        $service->quantity = $this->invoice_detail['quantity'];
        array_push($services, $service);
        $invoice_details = $this->invoice_detail_repository->store($this->invoice['id'], $services);
        $this->assertInstanceOf(InvoiceDetail::class, $invoice_details[0]);
        $this->assertDatabaseHas('invoice_details', $this->invoice_detail);
    }

    public function tearDown() : void
    {
        $all_renters_id = User::where('occupation', 'test data')->pluck('id');
        foreach($all_renters_id as $renter_id) {
            $all_renter_invoices_id = Invoice::where('renter_id', $renter_id)->pluck('id');
            foreach($all_renter_invoices_id as $invoice_id) {
                InvoiceDetail::where('invoice_id', $invoice_id)->delete();
            }
            Invoice::where('renter_id', $renter_id)->delete();
            User::where('id', $renter_id)->delete();
        }
        Service::where('description', 'test data')->delete();
        parent::tearDown();
    }
}
