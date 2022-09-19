<?php

namespace App\Repositories\Invoice;

interface InvoiceRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data, $renter_id);
    public function update(array $data, $id);
    public function delete($id);

    public function checkCreated($id, $month);
    public function getInvoiceDetails($id);
    public function checkPaid($id);
    public function checkOverdue($id);
}