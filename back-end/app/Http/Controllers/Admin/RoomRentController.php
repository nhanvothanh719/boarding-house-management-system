<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\CustomHelper;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use App\Repositories\RoomRent\RoomRentRepositoryInterface;

class RoomRentController extends Controller
{
    protected $rent;

    public function __construct(RoomRentRepositoryInterface $rent) {
        $this->rent = $rent;
    }

    public function index() {
        $all_room_rents = $this->rent->all();
        return response([
            'status' => 200,
            'allRoomRents' => $all_room_rents,
        ]);
    }

    public function rentRoom(Request $request) {
        $validator = Validator::make($request->all(), [
            'renter_id' => 'unique:room_rents|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        if(CustomHelper::isAdminRole($request->renter_id))
        {
            return response([
                'message' => 'The user is not renter',
                'status' => 403,
            ]);
        }
        $is_updated = CustomHelper::updateIncreaseRoomStatus($request->room_id, $request->renter_id);
        if(!$is_updated) {
            return response([
                'message' => 'Cannot add renter due to room status or gender of renter',
                'status' => 403,
            ]);
        }
        $rent = $this->rent->store($request->all());
        return response([
            'message' => 'Add renter successfully',
            'status' => 200,
        ]);
    }

    public function cancelRentRoom($id) {
        $rent = $this->rent->show($id);
        if(!$rent) {
            return response([
                'message' => 'The room rent has not been made',
                'status' => 404,
            ]);
        }
        $is_updated = CustomHelper::updateDecreaseRoomStatus($rent->room_id);
        $this->rent->delete($id);
        return response([
            'message' => 'Remove rent successfully',
            'status' => 200,
        ]);
    }
}
