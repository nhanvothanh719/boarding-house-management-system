<?php

namespace App\Repositories\RoomImage;

interface RoomImageRepositoryInterface
{
    public function store($files, $room_id);
    public function update($files, $room_id);
    public function delete($room_id);
}