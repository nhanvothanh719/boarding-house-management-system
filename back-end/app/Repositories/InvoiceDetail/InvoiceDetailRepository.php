<?php

namespace App\Repositories\InvoiceDetail;

use App\Models\InvoiceDetail;

class InvoiceDetailRepository implements InvoiceDetailRepositoryInterface 
{
    public function store($invoice_id, $services) {
        foreach($services as $service) {
            $invoice_detail = new InvoiceDetail;
            $invoice_detail->invoice_id = $invoice_id;
            $invoice_detail->service_id = $service['id'];
            $invoice_detail->quantity = abs($service['quantity']);
            $service_unit_price = abs($service['unit_price']);
            $invoice_detail->subtotal = round(abs($service['quantity']) * $service_unit_price, 2);
            $invoice_detail->save();
        }
    }

    public function calculateServiceTotal($invoice_id) {
        $total = 0;
        $services_subtotal = InvoiceDetail::where('invoice_id', $invoice_id)->pluck('subtotal');
        foreach($services_subtotal as $subtotal) {
            $total = $total + $subtotal;
        }
        return $total;
    }

    public function findByInvoiceId($invoice_id) {
        return InvoiceDetail::where('invoice_id', $invoice_id)->get();
    }
}