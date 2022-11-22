<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use App\Repositories\Room\RoomRepositoryInterface;

class RoomController extends Controller
{   
    protected $room;

    public function __construct(RoomRepositoryInterface $room) {
        $this->room = $room;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRooms' => $this->room->all(),
        ]);
    }

    public function storeRoom(Request $request) {
        $validator = Validator::make($request->all(), [
            'number' => 'required|unique:rooms|alpha_num',
            'category_id' => 'required|exists:categories,id',
            'area' => 'required|digits_between:2,4|min:100|integer',
            'description' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $room = $this->room->store($request->all());
        return response([
            'message' => 'Create new room successfully',
            'status' => 200,
        ]);
    }

    public function editRoom($id) {
        $room = $this->room->show($id);
        if($room) {
            return response([
                'status' => 200,
                'room' => $room,
            ]);
        }
        return response([
            'status' => 404,
            'message' => 'No room found',
        ]);
    }

    public function updateRoom(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'number' => 'required|unique:rooms,number,'.$id,
            'category_id' => 'required|exists:categories,id',
            'area' => 'required|digits_between:2,4|min:100|integer',
            'description' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $room = $this->room->show($id);
        $old_room_number = $room->number;
        if($room) {
            if($request->hasFile('image')) {
                $files = $request->file('image');
                $this->room->updateImages($files, $id);
            }
            $this->room->update($request->all(), $id);
            return response([
                'message' => 'Successfully update room',
                'status' => 200,
            ]);
        }
        return response([
            'message' => 'No room found',
            'status' => 404,
        ]);
    }

    public function deleteRoom($id) {
        $room = $this->room->show($id);
        if($room) {
            if($this->room->checkUsed($id)) {
                return response([
                    'message' => 'Cannot delete room since it has renter(s)',
                    'status' => 400,
                ]);
            }
            $this->room->delete($id);
            return response([
                'status' => 200,
                'message' => 'Successfully delete room',
            ]);
        }
        return response([
            'message' => 'No room found',
            'status' => 404,
        ]);
    }

    public function countRoomsByStatus() {
        return response([
            'status' => 200,
            'roomsCount' => $this->room->countRoomsByStatus()
        ]);
    }

    public function countRooms() {
        return response([
            'status' => 200,
            'total' => $this->room->countRooms(),
        ]);
    }
}
