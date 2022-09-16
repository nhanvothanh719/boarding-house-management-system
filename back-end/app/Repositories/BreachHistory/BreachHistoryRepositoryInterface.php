<?php

namespace App\Repositories\BreachHistory;

interface BreachHistoryRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function delete($id);

    public function calculateBreachRemainAllowedNumber($renter_id, $breach_id);
}