<?php

namespace App\Repositories\Invoice;

use App\Helpers\CustomHelper;

use stdClass;

use App\Models\Invoice;

use App\Repositories\InvoiceDetail\InvoiceDetailRepositoryInterface;
use App\Repositories\PaymentHistory\PaymentHistoryRepositoryInterface;

class InvoiceRepository implements InvoiceRepositoryInterface 
{
    private $invoice_detail_repository;
    private $payment_history_repository;

    public function __construct(InvoiceDetailRepositoryInterface $invoice_detail_repository, PaymentHistoryRepositoryInterface $payment_history_repository) 
    {
        $this->invoice_detail_repository = $invoice_detail_repository;
        $this->payment_history_repository = $payment_history_repository;
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
        $total = $this::updateTotal($invoice->id, $data['discount']);
        $current_invoice = Invoice::find($invoice->id);
        $current_invoice->total = round($total, 2);
        $current_invoice->save();
        return $invoice;
    }

    public function update($data, $id) {
        $invoice = $this::show($id);
        if($data['is_paid'] == Invoice::STATUS_PAID) {
            $invoice->is_paid = Invoice::STATUS_PAID;
            $renter_id = $invoice->renter_id;
            $this->payment_history_repository->addPaymentHistory($id, $renter_id, Invoice::PAYMENT_METHOD_CASH);
        }
        $invoice->effective_from = $data['effective_from'];
        $invoice->valid_until = $data['valid_until'];
        $invoice->month = $data['month'];
        $invoice->save();

        $invoice_info = new stdClass();
        $invoice_info->month = $invoice->month;
        $invoice_info->year = $invoice->year;
        $invoice_info->amount = $invoice->total;
        $invoice_info->payment_method = Invoice::PAYMENT_METHOD_CASH;

        $add_balance = CustomHelper::handleAfterPayment($invoice_info, $invoice->renter_id, $id);
    }

    public function delete($id) {
        $invoice = $this::show($id);
        $invoice->services()->delete();
        $invoice->payment()->delete();
        $invoice->delete();
    }

    public function checkCreated($id, $month) {
        $is_created = false;
        if(Invoice::where('renter_id', $id)->where('month', $month)->count() > 0) {
            $is_created = true;
        }
        return $is_created;
    }

    public function updateTotal($invoice_id, $discount) {
        $total = 0;
        //Call function to calculate service fee
        $total = $this->invoice_detail_repository->calculateServiceTotal($invoice_id);
        if($discount !== 0) {
            $total = $total * (100 - $discount) / 100;
        }
        $extra_fee = Invoice::find($invoice_id)->extra_fee;
        if($extra_fee) {
            $total = $total + $extra_fee;
        }
        return $total;
    }

    public function getInvoiceDetails($id)
    {
        return $this->invoice_detail_repository->findByInvoiceId($id);
    }

    public function checkPaid($id) {
        $is_paid = false;
        if($this::show($id)->is_paid == Invoice::STATUS_PAID) {
            return true;
        }
        return $is_paid;
    }
}