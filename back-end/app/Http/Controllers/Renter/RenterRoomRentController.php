<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

use App\Repositories\RoomRent\RoomRentRepositoryInterface;

class RenterRoomRentController extends Controller
{
    protected $rent;

    public function __construct(RoomRentRepositoryInterface $rent) {
        $this->rent = $rent;
    }

    public function getRenterRoomInfo() {
        $current_renter_id = Auth::user()->id;
        $has_room = $this->rent->checkRentRoom($current_renter_id);
        if(!$has_room) {
            return response([
                'status' => 404,
                'message' => "Room not found",
            ]);
        }
        return response([
            'status' => 200,
            'room' => $this->rent->getRenterRoom($current_renter_id),
            'roommates' => $this->rent->getRenterCurrentRoomPartners($current_renter_id),
        ]);
    }
}
