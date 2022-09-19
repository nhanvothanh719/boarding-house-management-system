<?php

namespace App\Repositories\Balance;

interface BalanceRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function groupRecentBalanceChangesByDate();
    public function calculateRecentChanges();
    public function getRecentBalanceChanges();
    public function calculateExpenseRate();
    public function handleAfterPayment($invoice, $payment_method);
}