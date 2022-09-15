<?php

namespace App\Repositories\Room;

use App\Models\Room;
use App\Models\RoomStatus;

class RoomRepository implements RoomRepositoryInterface
{
    // protected $room = null;

    public function all() {
        return Room::all();
     }

    public function show($id) {
        return Room::find($id);
    }

    // public function store($request) {
    //     $room = new Room;
    //     $room->number = $request->input('number');
    //     $empty_status_id = RoomStatus::where('name', RoomStatus::STATUS_EMPTY)->value('id');
    //     $room->status_id = $empty_status_id;
    //     $room->category_id = $request->input('category_id');
    //     $room->description = $request->input('description');
    //     $room->area = $request->input('area');
    //     $room->has_conditioner = $request->input('has_conditioner') == true ? '1' : '0';
    //     $room->has_fridge = $request->input('has_fridge') == true ? '1' : '0';
    //     $room->has_wardrobe = $request->input('has_wardrobe') == true ? '1' : '0';
    //     $room->save();
        
    //     if($request->hasFile('image')) {
    //         $files = $request->file('image');
    //         $upload_folder = 'uploaded/rooms/'.$room->number.'/';
    //         if(!file_exists($upload_folder)) {
    //             mkdir($upload_folder);
    //         }
    //         foreach ($files as $file) {
    //             $generated_name = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
    //             $image = $upload_folder.$generated_name;
    //             //Save img in public folder
    //             Image::make($file)->resize(300, 200)->save($image);
    //             //Save img in database
    //             $room_image = new RoomImages;
    //             $room_id = Room::where('number', $room->number)->value('id');
    //             $room_image->room_id = $room_id;
    //             $room_image->image_name = $image;
    //             $room_image->save();
    //         }
    //     }
    //     return $room;
    // }

    // public function update($request, $id) {
    //     $old_number = Room::where('id', $id)->value('number');
    //     $room->number = $request->input('number');
    //     $room->category_id = $request->input('category_id');
    //     $room->description = $request->input('description');
    //     $room->area = $request->input('area');
    //     $room->has_conditioner = $request->input('has_conditioner');
    //     $room->has_fridge = $request->input('has_fridge');
    //     $room->has_wardrobe = $request->input('has_wardrobe');
    //     $room->save();

    //     if($request->hasFile('image')) {
    //         $upload_folder = 'uploaded/rooms/'.$room->number.'/';
    //         //Delete existed images:
    //         //In folder
    //         if(File::exists($upload_folder)) {
    //             $images = DB::table('room_images')
    //             ->where('room_id', $id)
    //             ->pluck('image_name');
    //             foreach ($images as $image) {
    //                 unlink($image);
    //             }
    //         }
    //         //In database
    //         RoomImages::where('room_id', $id)->delete();
    //         //Store new images
    //         $files = $request->file('image');
    //         if(!file_exists($upload_folder)) {
    //             mkdir($upload_folder);
    //         }
    //         foreach ($files as $file) {
    //             $generated_name = hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
    //             $image = $upload_folder.$generated_name;
    //             //Save img in public folder
    //             Image::make($file)->resize(300, 200)->save($image);
    //             //Save img in database
    //             $room_image = new RoomImages;
    //             $room_id = Room::where('number', $room->number)->value('id');
    //             $room_image->room_id = $room_id;
    //             $room_image->image_name = $image;
    //             $room_image->save();
    //         }
    //     }
    //     return $room;
    // }

    // public function findById($id) {
    //     return Room::find($id);
    // }

    // public function destroy($id) {
    //     //Delete existed images:
    //     $upload_folder = 'uploaded/rooms/'.$room_number.'/';
    //     //In folder
    //     File::deleteDirectory(public_path($upload_folder));
    //     //In database
    //     RoomImages::where('room_id', $id)->delete();
    //     $room->delete();
    // }

    // public function checkEmpty($id) {
    //     $is_empty = false;
    //     $room_status_id = Room::where('id', $id)->value('status_id');
    //     $empty_status_id = RoomStatus::where('name', RoomStatus::STATUS_EMPTY)->value('id');
    //     if($room_status_id == $empty_status_id) {
    //         return true;
    //     }
    // }

    public function getAvailableRooms() {
        $full_status_id = RoomStatus::where('name', RoomStatus::STATUS_FULL)->value('id');
        return Room::where('status_id', '!=', $full_status_id)->get();
    }

    // public function findRoomInCategory($id) {
    //     $room = Room::where('category_id', $id)->first();
    //     if($room) {
    //         return true;
    //     }
    //     return false;
    // }
}