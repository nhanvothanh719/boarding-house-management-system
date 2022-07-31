<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\PaymentHistory;
use App\Models\PaymentMethod;

class PaymentController extends Controller
{
    public function makePayment(Request $request, $id) {
        $user_id = Auth::user()->id;
        $payment = new PaymentHistory;
        $payment->invoice_id = $id;
        $payment->payment_id = $request->payment_id;
        $payment_method = $request->payment_method;
        $payment->payment_method_id = PaymentMethod::where('name', $payment_method)->value('id');
        $payment->made_by_user_id = $user_id;
        $payment->made_at = date('Y-m-d H:i:s');
        $payment->save();
        return response([
            'status' => 200,
            'message' => 'The invoice is paid successfully'
        ]);
    }
}
