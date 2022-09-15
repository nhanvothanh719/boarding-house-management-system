<?php

namespace App\Repositories\RoomCategory;

interface RoomCategoryRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function checkUsed($id);
}