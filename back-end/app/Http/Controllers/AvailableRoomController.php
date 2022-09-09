<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Room;
use App\Models\RoomStatus;

class AvailableRoomController extends Controller
{
    public function displayAllAvailableRooms() {
        $full_status_id = RoomStatus::where('name', RoomStatus::STATUS_FULL)->value('id');
        $available_rooms = Room::where('status_id', '!=', $full_status_id)->get();
        return response([
            'status' => 200,
            'availableRooms' => $available_rooms,
        ]);
    }

    public function getAvailableRoomDetails($id) {
        $room_details = Room::where('id', $id)->get();
        return response([
            'details' => $room_details,
            'status' => 200,
        ]);
    }
}
