<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use App\Helpers\CustomHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\PaymentMethod;
use App\Models\PaymentHistory;

class RenterInvoiceController extends Controller
{
    public function getRenterInvoices() {
        $current_renter_id = Auth::user()->id;
        $unpaid_invoices = Invoice::where('renter_id', $current_renter_id)->where('is_paid', Invoice::STATUS_NOT_PAID)->get();
        $paid_invoices = Invoice::where('renter_id', $current_renter_id)->where('is_paid', Invoice::STATUS_PAID)->get();
        return response([
            'status' => 200,
            'unpaidInvoices' => $unpaid_invoices,
            'paidInvoices' => $paid_invoices,
        ]);
    }

    public function getInvoiceDetails($id) {
        $invoice = Invoice::find($id);
        if(!$invoice) {
            return response([
                'status' => 404,
                'message' => 'No invoice found',
            ]);
        }
        $invoice_details = InvoiceDetail::where('invoice_id', $id)->get();
        return response([
            'status' => 200,
            'invoice' => $invoice,
            'invoiceDetails' => $invoice_details,
        ]);
    }

    // public function makePayment(Request $request, $id) {
        
    // }
}
