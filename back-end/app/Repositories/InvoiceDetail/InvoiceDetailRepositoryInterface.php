<?php

namespace App\Repositories\InvoiceDetail;

interface InvoiceDetailRepositoryInterface
{
    public function store($invoice_id, $services);

    public function calculateServiceTotal($invoice_id);
    public function findByInvoiceId($invoice_id);
}