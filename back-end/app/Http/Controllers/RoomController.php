<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Room;

class RoomController extends Controller
{
    public function index() {
        $allRooms = Room::all();
        return response([
            'status' => 200,
            'allRooms' => $allRooms,
        ]);
    }

    public function displayAllAvailableRooms() {
        $rooms = Room::all();
        return $rooms;
    }

    public function getRoomDetails($id) {
        $room_details = Room::where('id', $id)->get();
        return $room_details;
    }

    public function storeRoom(Request $request) {
        $validator = Validator::make($request->all(), [
            'number' => 'required|unique:rooms',
            'status' => 'required',
            'category_id' => 'required',
            'area' => 'required|digits_between:2,4',
            'description' => 'required',

        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        try {
            $room = new Room;
            $room->number = $request->input('number');
            $room->status = $request->input('status');
            $room->category_id = $request->input('category_id');
            $room->description = $request->input('description');
            $room->area = $request->input('area');
            $room->has_conditioner = $request->input('has_conditioner') == true ? '1' : '0';
            $room->has_fridge = $request->input('has_fridge') == true ? '1' : '0';
            $room->has_wardrobe = $request->input('has_wardrobe') == true ? '1' : '0';
            // if($request->hasFile('image')) {
            //     $file = $request->file('image');
            //     $extension = $file->getClientOriginalExtension();
            //     $fileName = $time().'.'.$extension;
            //     //Save img in public folder
            //     $file->move('uploaded/rooms/', $fileName);
            //     //Save img in database
            //     $room->image = 'uploaded/rooms/'.$fileName;
            // }
            $room->save();
            return response([
                'message' => 'Successfully create new room',
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
                'status' => 400,
            ], 400);
        }
    }
}
