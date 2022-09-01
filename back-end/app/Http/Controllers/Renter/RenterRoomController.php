<?php

namespace App\Http\Controllers\Renter;

use \stdClass;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Room;
use App\Models\RoomImages;
use App\Models\Category;
use App\Models\RoomStatus;
use App\Models\RoomRent;
use App\Models\User;

class RenterRoomController extends Controller
{
    public function getRoomInfo() {
        $current_renter_id = Auth::user()->id;
        $room_id = RoomRent::where('renter_id', $current_renter_id)->value('room_id');
        $room = Room::find($room_id);
        $roommates_id = RoomRent::where('room_id', $room_id)->pluck('renter_id');
        $roommates = array();
        foreach($roommates_id as $roommate_id) {
            $roommate = User::find($roommate_id);
            array_push($roommates, $roommate);
        }
        return response([
            'status' => 200,
            'room' => $room,
            'roommates' => $roommates,
        ]);
    }
}
