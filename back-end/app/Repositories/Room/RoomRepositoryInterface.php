<?php

namespace App\Repositories\Room;

interface RoomRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function getAvailableRooms();
    public function checkUsed($id);
}