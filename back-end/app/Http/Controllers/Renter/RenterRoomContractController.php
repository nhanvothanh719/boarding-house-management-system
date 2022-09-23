<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Repositories\RoomContract\RoomContractRepositoryInterface;

class RenterRoomContractController extends Controller
{
    protected $contract;

    public function __construct(RoomContractRepositoryInterface $contract) {
        $this->contract = $contract;
    }

    public function getRenterRoomContract() {
        $current_renter_id = Auth::user()->id;
        $room_contract = $this->contract->findRoomContractByRenterId($current_renter_id);
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