<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use App\Repositories\RoomRentRegistration\RoomRentRegistrationRepositoryInterface;

class RoomRentRegistrationController extends Controller
{
    protected $request;

    public function __construct(RoomRentRegistrationRepositoryInterface $request) {
        $this->request = $request;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRoomRentRegistrations' => $this->request->all(),
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
        $room_rent_registration = $this->request->store($request->all());
        return response([
            'message' => 'Send request successfully',
            'status' => 200,
        ], 200);
    }

    public function deleteRoomRentRegistration($id) {
        $room_rent_registration = $this->request->show($id);
        if(!$room_rent_registration) {
            return response([
                'message' => 'The request for registration does not exist',
                'status' => 404,
            ]);
        }
        $this->request->delete($id);
        return response([
            'message' => 'Delete room rent registration successfully',
            'status' => 200,
        ]);
    }

    public function acceptRegistrationRequest($id) {
        $room_rent_registration = $this->request->show($id);
        if(!$room_rent_registration) {
            return response([
                'message' => 'The request for registration does not exist',
                'status' => 404,
            ]);
        }
        $is_accepted = $this->request->accept($id);
        if($is_accepted) {
            return response([
                'message' => 'Update request for registration status successfully',
                'status' => 200,
            ]);
        }
        return response([
            'message' => 'Cannot update due to gender of sender or room condition',
            'status' => 400,
        ]);
        
    }
}
