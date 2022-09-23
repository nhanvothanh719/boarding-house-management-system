<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use App\Repositories\Invoice\InvoiceRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class RenterInvoiceController extends Controller
{
    protected $invoice;

    public function __construct(InvoiceRepositoryInterface $invoice) {
        $this->invoice = $invoice;
    }

    public function getInvoiceDetails($id) {
        $invoice = $this->invoice->show($id);
        if(!$invoice) {
            return response([
                'status' => 404,
                'message' => 'No invoice found',
            ]);
        }
        $invoice_details = $this->invoice->getInvoiceDetails($invoice->id);
        return response([
            'status' => 200,
            'invoice' => $invoice,
            'invoiceDetails' => $invoice_details,
        ]);
    }

    public function getRenterInvoices() {
        $current_renter_id = Auth::user()->id;
        return response([
            'status' => 200,
            'unpaidInvoices' => $this->invoice->getRenterUnpaidInvoices($current_renter_id),
            'paidInvoices' => $this->invoice->getRenterPaidInvoices($current_renter_id),
        ]);
    }
}
