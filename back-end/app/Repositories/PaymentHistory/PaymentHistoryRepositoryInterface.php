<?php

namespace App\Repositories\PaymentHistory;

interface PaymentHistoryRepositoryInterface
{
    public function addPaymentHistory($id, $renter_id, $payment_method_id);
}