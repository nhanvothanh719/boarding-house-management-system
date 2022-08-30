<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Room;
use App\Models\RoomRentRegistration;

class RoomRentRegistrationController extends Controller
{
    public function index() {
        return response([
            'status' => 200,
            'allRoomRentRegistrations' => RoomRentRegistration::all(),
            'allRoomInfos' => Room::pluck('number','id'),
        ]);
    }

    public function storeRoomRentRegistration(Request $request) {
        $validator = Validator::make($request->all(), [
            'sender_name' => 'required|max:50|string',
            'sender_email' => 'required|max:50|string',
            'sender_phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $room_rent_registration = new RoomRentRegistration;
        $room_rent_registration->sender_name = $request->sender_name;
        $room_rent_registration->sender_email = $request->sender_email;
        $room_rent_registration->sender_phone_number = $request->sender_phone_number;
        $room_rent_registration->registered_room_id = $request->registered_room_id;
        $room_rent_registration->save();
        return response([
            'message' => 'Send request successfully',
            'status' => 200,
        ], 200);
    }

    public function deleteRoomRentRegistration($id) {
        $room_rent_registration = RoomRentRegistration::find($id);
        if(!$room_rent_registration) {
            return response([
                'message' => 'The room rent registration does not exist',
                'status' => 404,
            ]);
        }
        $room_rent_registration->delete();
        return response([
            'message' => 'Delete room rent registration successfully',
            'status' => 200,
        ]);
    }
}
