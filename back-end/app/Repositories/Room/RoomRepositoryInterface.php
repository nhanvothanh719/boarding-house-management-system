<?php

namespace App\Repositories\Room;

interface RoomRepositoryInterface
{
    public function all();
    public function show($id);
    public function store($request);
    public function update($request, $id);
    public function delete($id);

    public function getAvailableRooms();
    // public function checkEmpty($id);
}