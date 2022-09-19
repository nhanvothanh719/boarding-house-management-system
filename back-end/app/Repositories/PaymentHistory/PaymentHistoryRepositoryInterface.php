<?php

namespace App\Repositories\PaymentHistory;

interface PaymentHistoryRepositoryInterface
{
    public function store($data, $invoice_id);
}