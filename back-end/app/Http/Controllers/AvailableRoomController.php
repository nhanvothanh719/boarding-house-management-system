<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Room;
use App\Models\RoomStatus;

use App\Repositories\Room\RoomRepositoryInterface;

class AvailableRoomController extends Controller
{
    protected $room;

    public function __construct(RoomRepositoryInterface $room) {
        $this->room = $room;
    }
    
    public function displayAllAvailableRooms() {
        return response([
            'status' => 200,
            'availableRooms' => $this->room->getAvailableRooms(),
        ]);
    }

    public function getAvailableRoomDetails($id) {
        return response([
            'room' => $this->room->show($id),
            'status' => 200,
        ]);
    }
}
