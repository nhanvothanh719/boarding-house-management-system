<?php

namespace App\Repositories\RoomRent;

interface RoomRentRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);
}