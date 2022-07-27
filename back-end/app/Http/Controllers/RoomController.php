<?php

namespace App\Http\Controllers;

use App\Helpers\CustomHelper;

use Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\File; 

use App\Models\Room;
use App\Models\RoomImages;
use App\Models\Category;
use App\Models\RoomStatus;
use App\Models\RoomRent;
use App\Models\User;

class RoomController extends Controller
{
    public function index() {
        $all_rooms = Room::all();
        return response([
            'status' => 200,
            'allRooms' => $all_rooms,
        ]);
    }

    public function getAllRoomRents() {
        $all_room_rents = RoomRent::all();
        return response([
            'status' => 200,
            'allRoomRents' => $all_room_rents,
        ]);
    }

    public function getAllRoomStatuses() {
        $all_statuses = RoomStatus::all();
        return response([
            'status' => 200,
            'allStatuses' => $all_statuses,
        ]);
    }

    public function displayAllAvailableRooms() {
        $rooms = Room::all();
        return $rooms;
    }

    public function getRoomDetails($id) {
        $room_details = Room::where('id', $id)->get();
        $room_category_id = Room::where('id', $id)->value('category_id');
        $room_price= Category::where('id', $room_category_id)->value('price');
        $category = Category::where('id', $room_category_id)->get('name');
        $room_images = RoomImages::where('room_id', $id)->get();
        return response([
            'details' => $room_details,
            'images' => $room_images,
            'category' => $category,
            'price' => $room_price,
            'status' => 200,
        ]);
    }

    public function storeRoom(Request $request) {
        $validator = Validator::make($request->all(), [
            'number' => 'required|unique:rooms',
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
            $empty_status_id = RoomStatus::where('name', RoomStatus::STATUS_EMPTY)->value('id');
            $room->status = $empty_status_id;
            $room->category_id = $request->input('category_id');
            $room->description = $request->input('description');
            $room->area = $request->input('area');
            $room->has_conditioner = $request->input('has_conditioner') == true ? '1' : '0';
            $room->has_fridge = $request->input('has_fridge') == true ? '1' : '0';
            $room->has_wardrobe = $request->input('has_wardrobe') == true ? '1' : '0';
            $room->save();
            
            if($request->hasFile('image')) {
                $files = $request->file('image');
                $upload_folder = 'uploaded/rooms/'.$room->number.'/';
                if(!file_exists($upload_folder)) {
                    mkdir($upload_folder);
                }
                foreach ($files as $file) {
                    $generated_name = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
                    $image = $upload_folder.$generated_name;
                    //Save img in public folder
                    Image::make($file)->resize(300, 200)->save($image);
                    //Save img in database
                    $room_image = new RoomImages;
                    $room_id = Room::where('number', $room->number)->value('id');
                    $room_image->room_id = $room_id;
                    $room_image->image_name = $image;
                    $room_image->save();
                }
            }
            return response([
                'message' => 'Create new room successfully',
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

    public function editRoom($id) {
        $room = Room::find($id);
        if($room) {
            $room_images = RoomImages::where('room_id', $id)->get();
            return response([
                'status' => 200,
                'room' => $room,
                'images' => $room_images,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No room ID found',
            ]);
        }
    }

    public function updateRoom(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'number' => 'required|unique:rooms,number,'.$id,
            'category_id' => 'required',
            'area' => 'required|digits_between:2,4',
            'description' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $room = Room::find($id);
        if($room) {
            $old_number = Room::where('id', $id)->value('number');
            $room->number = $request->input('number');
            $room->category_id = $request->input('category_id');
            $room->description = $request->input('description');
            $room->area = $request->input('area');
            $room->has_conditioner = $request->input('has_conditioner');
            $room->has_fridge = $request->input('has_fridge');
            $room->has_wardrobe = $request->input('has_wardrobe');
            $room->save();

            if($request->hasFile('image')) {
                $upload_folder = 'uploaded/rooms/'.$room->number.'/';
                //Delete existed images:
                //In folder
                if(File::exists($upload_folder)) {
                    $images = DB::table('room_images')
                    ->where('room_id', $id)
                    ->pluck('image_name');
                    foreach ($images as $image) {
                        unlink($image);
                    }
                }
                //In database
                RoomImages::where('room_id', $id)->delete();
                //Store new images
                $files = $request->file('image');
                if(!file_exists($upload_folder)) {
                    mkdir($upload_folder);
                }
                foreach ($files as $file) {
                    $generated_name = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
                    $image = $upload_folder.$generated_name;
                    //Save img in public folder
                    Image::make($file)->resize(300, 200)->save($image);
                    //Save img in database
                    $room_image = new RoomImages;
                    $room_id = Room::where('number', $room->number)->value('id');
                    $room_image->room_id = $room_id;
                    $room_image->image_name = $image;
                    $room_image->save();
                }
            }
            return response([
                'message' => 'Successfully update room',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No room found',
                'status' => 404,
            ]);
        }
    }

    public function deleteRoom($id) {
        $room = Room::find($id);
        if($room) {
            $room_status = Room::where('id', $id)->value('status');
            $room_number = Room::where('id', $id)->value('number');
            $empty_status_id = RoomStatus::where('name', RoomStatus::STATUS_EMPTY)->value('id');
            if($room_status != $empty_status_id) {
                return response([
                    'message' => 'Cannot delete room' .$room_number. ' since it is used: ',
                    'status' => 404,
                ]);
            }
            //Delete existed images:
            $upload_folder = 'uploaded/rooms/'.$room_number.'/';
            //In folder
            File::deleteDirectory(public_path($upload_folder));
            //In database
            RoomImages::where('room_id', $id)->delete();
            $room->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete room',
            ]);
        } else {
            return response([
                'message' => 'No room with the ID found',
                'status' => 404,
            ]);
        }
    }

    public function rentRoom(Request $request) {
        $validator = Validator::make($request->all(), [
            'renter_id' => 'unique:room_rents',
            'room_number' => 'required',
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
                'status' => 404,
            ]);
        }
        $room_id = Room::where('number', $request->room_number)->value('id');
        $room = Room::find($room_id);
        $room_status = $room->status;
        switch($room_status) {
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL)):
                return response([
                    'message' => 'Cannot add renter since the room is full',
                    'status' => 404,
                ]);
                break;
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_EMPTY)):
                $rent = new RoomRent;
                $rent->room_id = $room_id;
                $rent->renter_id = $request->renter_id;
                $rent->save();
                $room->status = CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED);
                $room->save();
                break;
            case(CustomHelper::getRoomStatusId(RoomStatus::STATUS_OCCUPIED)):
                $rent = new RoomRent;
                $rent->room_id = $room_id;
                $rent->renter_id = $request->renter_id;
                $rent->save();
                $room->status = CustomHelper::getRoomStatusId(RoomStatus::STATUS_FULL);
                $room->save();
                break;
        }
        return response([
            'message' => 'Add renter successfully',
            'status' => 200,
        ]);
    }
}
