<?php

namespace App\Repositories\PaymentHistory;

use App\Helpers\CustomHelper;

use App\Models\PaymentHistory;

class PaymentHistoryRepository implements PaymentHistoryRepositoryInterface 
{
    public function addPaymentHistory($id, $renter_id, $payment_method_id) {
        $payment = new PaymentHistory;
        $payment->invoice_id = $id;
        $payment->payment_id = 'pay_by_cash_for_invoice_'.$id;
        $payment->payment_method_id = $payment_method_id;
        $payment->made_by = $renter_id;
        $payment->made_at = date('Y-m-d H:i:s');
        $payment->save();
    }
}