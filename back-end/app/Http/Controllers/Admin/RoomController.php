<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Helpers\CustomHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;

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
        if($request->hasFile('image')) {
            $files = $request->file('image');
            $are_images_stored = CustomHelper::storeRoomImages($files, $room->id);
        }
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
        if($room) {
            $this->room->update($request->all(), $id);
            if($request->hasFile('image')) {
                //Update images
                $files = $request->file('image');
                $are_images_updated = CustomHelper::updateRoomImages($files, $id);
            }
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
                    'message' => 'Cannot delete room since it is used',
                    'status' => 403,
                ]);
            }
            //Delete images
            $are_images_deleted = CustomHelper::deleteRoomImages($id);
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

    // public function getAllRoomStatuses() {
    //     $all_statuses = RoomStatus::all();
    //     return response([
    //         'status' => 200,
    //         'allStatuses' => $all_statuses,
    //     ]);
    // }
}
