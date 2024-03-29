<?php

namespace App\Repositories\Invoice;

use App\Models\Invoice;

use App\Repositories\InvoiceDetail\InvoiceDetailRepositoryInterface;
use Carbon\Carbon;
use stdClass;

class InvoiceRepository implements InvoiceRepositoryInterface 
{
    private $invoice_detail_repository;

    public function __construct(InvoiceDetailRepositoryInterface $invoice_detail_repository) 
    {
        $this->invoice_detail_repository = $invoice_detail_repository;
    }

    public function all() {
        return Invoice::all();
    }

    public function show($id) {
        return Invoice::find($id);
    }

    public function store($data, $renter_id) {
        $current_year = date('Y');
        //Create invoice without calculating total
        $invoice = Invoice::create([
            'renter_id' => $renter_id,
            'discount' => $data['discount'],
            'month' => $data['month'],
            'year' => $current_year,
            'effective_from' => $data['effective_from'],
            'valid_until' => $data['valid_until'],
            "extra_fee" => $data['extra_fee'],
            'extra_fee_description' => $data['extra_fee_description'],
        ]);
        //Create invoice details
        $this->invoice_detail_repository->store($invoice->id, $data['services']);
        //Update total value
        $total = $this::updateTotal($invoice->id, $data['discount'],  $data['room_price']);
        $current_invoice = Invoice::find($invoice->id);
        $current_invoice->total = round($total, 2);
        $current_invoice->save();
        return $invoice;
    }

    public function update($data, $id) {
        $invoice = $this::show($id);
        $invoice->effective_from = $data['effective_from'];
        $invoice->valid_until = $data['valid_until'];
        $invoice->save();
        return $invoice;
    }

    public function delete($id) {
        $invoice = $this::show($id);
        $invoice->services()->delete();
        $invoice->payment()->delete();
        return $invoice->delete();
    }

    public function checkCreated($id, $month) {
        $is_created = false;
        if(Invoice::where('renter_id', $id)->where('month', $month)->count() > 0) {
            $is_created = true;
        }
        return $is_created;
    }

    public function updateTotal($invoice_id, $discount, $room_price) {
        $total = 0;
        //Call function to calculate service fee
        $total = $this->invoice_detail_repository->calculateServiceTotal($invoice_id) + $room_price;
        $extra_fee = Invoice::find($invoice_id)->extra_fee;
        if($extra_fee) {
            $total = $total + $extra_fee;
        }
        if($discount !== 0) {
            $total = $total * (100 - $discount) / 100;
        }
        return $total;
    }

    public function getInvoiceDetails($id)
    {
        return $this->invoice_detail_repository->findByInvoiceId($id);
    }

    public function checkPaid($id) {
        return $this::show($id)->payment == null ? false : true;;
    }

    public function checkOverdue($id) {
        $current_date = date('Y-m-d');
        $final_valid_date = Carbon::createFromFormat('Y-m-d', $this::show($id)->valid_until);
        return $final_valid_date->gt($current_date) ? true : false; //greater than
    }

    public function countInvoices() {
        return Invoice::count();
    }

    public function getRenterPaidInvoices($renter_id) {
        return Invoice::has('payment')->where('renter_id', $renter_id)->get();
    }

    public function getRenterUnpaidInvoices($renter_id) {
        return Invoice::doesntHave('payment')->where('renter_id', $renter_id)->get();
    }
}