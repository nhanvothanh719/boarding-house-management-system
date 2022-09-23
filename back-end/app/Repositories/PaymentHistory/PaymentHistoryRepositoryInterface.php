<?php

namespace App\Repositories\PaymentHistory;

interface PaymentHistoryRepositoryInterface
{
    public function store($data, $invoice_id);

    public function getPaidInvoicesRate();
    public function countPaidMethods();
}