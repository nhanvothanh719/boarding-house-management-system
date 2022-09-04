<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Room;
use App\Models\Balance;
use App\Models\Service;
use App\Models\Invoice;
use App\Models\RoomRent;
use App\Models\InvoiceDetail;
use App\Models\PaymentHistory;
use App\Models\ServiceRegistration;

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

    public function makePayment(Request $request, $id) {
        $user_id = Auth::user()->id;
        $payment = new PaymentHistory;
        $payment->invoice_id = $id;
        $payment->payment_id = $request->payment_id;
        $payment_method = $request->payment_method;
        $payment->payment_method_id = PaymentMethod::where('name', $payment_method)->value('id');
        $payment->made_by = $user_id;
        $payment->made_at = date('Y-m-d H:i:s');
        $payment->save();
        //Mark the invoice as is paid
        $invoice = Invoice::find($id);
        $invoice->is_paid = Invoice::STATUS_PAID;
        $invoice->save();
        PaymentController::handleAfterPayment($request, $user_id ,$id);
        return response([
            'status' => 200,
            'message' => 'The invoice is paid successfully'
        ]);
    }

    public function handleAfterPayment(Request $request, $user_id, $invoice_id) {
        //Automatically add income
        $balance = Balance::create([
            'description' => 'Income from invoice with ID: '.$invoice_id,
            'is_income' => 1,
            'amount' => $request->amount,
            'occurred_on' => date('Y-m-d', strtotime(' +0 day')),
        ]);
        //Send email confirmation
        $renter_email = User::find($user_id)->email;
        Mail::to($renter_email)->send(new InvoicePaidMail(
            $request->month,
            $request->year,
            $request->amount,
            $request->payment_method
        ));
    }
}
