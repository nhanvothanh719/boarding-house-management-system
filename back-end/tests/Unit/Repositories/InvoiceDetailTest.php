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
        $renter = User::factory()->create(['role' => 1]);
        $this->invoice = Invoice::factory()->create(['renter_id' => $renter->id]);
        $this->service = Service::factory()->create();
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
}
