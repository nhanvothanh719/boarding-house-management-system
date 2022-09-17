<?php

namespace App\Repositories\Invoice;

use App\Helpers\CustomHelper;
use App\Models\Invoice;

class InvoiceRepository implements InvoiceRepositoryInterface 
{
    public function all() {
        return Invoice::all();
    }

    public function show($id) {

    }

    public function store($data) {

    }

    public function update($data, $id) {

    }

    public function delete($id) {

    }
}