<?php

namespace App\Repositories\Room;

interface RoomRepositoryInterface
{
    public function showAll();
    public function show($id);
    // public function store($request);
    // public function update($request, $id);
    // public function destroy($id);
    // public function findById($id);

    public function getAvailableRooms();
    // public function checkEmpty($id);
}