<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RoomRentController extends Controller
{
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
        $user = User::find($request->renter_id);
        if(!$user) 
        {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        if(CustomHelper::isAdminRole($user))
        {
            return response([
                'message' => 'The user with ID is not renter',
                'status' => 403,
            ]);
        }
        $room_id = $request->room_id;
        $room = Room::find($room_id);
        $room_status_id = $room->status_id;
        switch($room_status_id) {
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL)):
                return response([
                    'message' => 'Cannot add renter since the room is full',
                    'status' => 403,
                ]);
                break;
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_EMPTY)):
                $rent = new RoomRent;
                $rent->room_id = $room_id;
                $rent->renter_id = $request->renter_id;
                $rent->save();
                $room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED);
                $room->save();
                break;
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED)):
                if(CustomHelper::checkSameGender($user->gender, $room_id) == false) {
                    return response([
                        'message' => 'Cannot add this renter due to his/her gender',
                        'status' => 403,
                    ]);
                }
                $rent = new RoomRent;
                $rent->room_id = $room_id;
                $rent->renter_id = $request->renter_id;
                $rent->save();
                $room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL);
                $room->save();
                break;
        }
        return response([
            'message' => 'Add renter successfully',
            'status' => 200,
        ]);
    }

    public function cancelRentRoom($id) {
        $rent = RoomRent::find($id);
        if(!$rent) {
            return response([
                'message' => 'The room rent has not been made',
                'status' => 404,
            ]);
        }
        $room = Room::find($rent->room_id);
        switch($room->status_id) {
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL)):
                $room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED);
                break;
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED)):
                $room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_EMPTY);
                break;
        }
        $room->save();
        $rent->delete();
        return response([
            'message' => 'Remove rent successfully',
            'status' => 200,
        ]);
    }

    public function getAllRoomRents() {
        $all_room_rents = RoomRent::all();
        return response([
            'status' => 200,
            'allRoomRents' => $all_room_rents,
        ]);
    }
}
