<?php

namespace App\Http\Controllers;

use App\Helpers\CustomHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Room;
use App\Models\RoomStatus;
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
            'sender_name' => 'required|max:50|string|regex:/^[a-zA-Z ]+$/',
            'sender_gender' => 'required|integer',
            'sender_email' => 'required|max:50|string|email',
            'sender_phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10',
            'registered_room_id' => 'required||exists:rooms,id'
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
        $room_rent_registration->sender_gender = $request->sender_gender;
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
                'message' => 'The request for registration does not exist',
                'status' => 404,
            ]);
        }
        $room_rent_registration->delete();
        return response([
            'message' => 'Delete room rent registration successfully',
            'status' => 200,
        ]);
    }

    public function acceptRegistrationRequest($id) {
        $room_rent_registration = RoomRentRegistration::find($id);
        if(!$room_rent_registration) {
            return response([
                'message' => 'The request for registration does not exist',
                'status' => 404,
            ]);
        }
        if(!$room_rent_registration->is_accepted) {
            $room_rent_registration->is_accepted = RoomRentRegistration::STATUS_ACCEPTED;
            $registered_room = Room::find($room_rent_registration->registered_room_id);
            switch($registered_room->status_id) {
                case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL)):
                    return response([
                        'message' => 'Cannot add renter since the room is full',
                        'status' => 404,
                    ]);
                    break;
                case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_EMPTY)):
                    $registered_room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED);
                    break;
                case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED)):
                    if(CustomHelper::checkSameGender($room_rent_registration->sender_gender, $room_rent_registration->registered_room_id) == false) {
                        return response([
                            'message' => 'Cannot add this renter due to his/her gender',
                            'status' => 404,
                        ]);
                    }
                    $registered_room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL);
                    break;
            }
        }
        else {
            $room_rent_registration->is_accepted = RoomRentRegistration::STATUS_NOT_ACCEPTED;
            $registered_room = Room::find($room_rent_registration->registered_room_id);
            switch($registered_room->status_id) {
                case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL)):
                    $registered_room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED);
                    break;
                case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED)):
                    $registered_room->status_id = CustomHelper::getRoomStatusId(RoomStatus::STATUS_EMPTY);
                    break;
            }
        }
        $room_rent_registration->save();
        $registered_room->save();
        return response([
            'message' => 'Request is accepted',
            'status' => 200,
        ]);
    }
}
