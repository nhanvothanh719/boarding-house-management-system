<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Room;

class RoomController extends Controller
{
    public function displayAllAvailableRooms() {
        $rooms = Room::all();
        return $rooms;
    }

    public function getRoomDetails($id) {
        $room_details = Room::where('id', $id)->get();
        return $room_details;
    }
}
