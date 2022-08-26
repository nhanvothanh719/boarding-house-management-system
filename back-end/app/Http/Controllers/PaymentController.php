<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

use App\Models\PaymentHistory;
use App\Models\PaymentMethod;
use App\Models\Invoice;
use App\Models\Balance;
use App\Models\User;

use App\Mail\InvoicePaidMail;

class PaymentController extends Controller
{
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
