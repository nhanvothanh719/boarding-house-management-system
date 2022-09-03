<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\RoomContract;

class RenterRoomContractController extends Controller
{
    public function getRenterRoomContract() {
        $current_renter_id = Auth::user()->id;
        $room_contract = RoomContract::where('renter_id', $current_renter_id)->firstOrFail();
        if(!$room_contract) {
            return response([
                'status' => 404,
                'message' => "Room contract has not created",
            ]);
        }
        return response([
            'status' => 200,
            'roomContract' => $room_contract,
        ]);
    }
}
