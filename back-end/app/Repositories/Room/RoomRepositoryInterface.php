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
    public function updateIncreaseRoomStatus($id);
    public function updateDecreaseRoomStatus($id);

    public function countRoomsByStatus();
    public function countRooms();

    public function updateImages($files, $id);
}