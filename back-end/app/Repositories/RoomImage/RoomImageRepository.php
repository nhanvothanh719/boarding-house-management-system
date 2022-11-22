<?php

namespace App\Repositories\RoomImage;

use App\Models\RoomImages;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class RoomImageRepository implements RoomImageRepositoryInterface
{
    public function store($images, $room_id) {
        $upload_folder = 'uploaded/rooms/'.$room_id;
        foreach ($images as $image) {
            $path = $image->store($upload_folder, 's3');
            //Save img in database
            $room_image = new RoomImages;
            $room_image->room_id = $room_id;
            $room_image->image_name = $path;
            $room_image->save();
        }
    }

    public function update($images, $room_id) {
        //Delete existed images:
        //In folder
        $upload_folder = 'uploaded/rooms/'.$room_id;
        $first_image = RoomImages::where('room_id', $room_id)->first();
        if($first_image != null) {
            if(Storage::disk('s3')->exists($upload_folder)) {
                Storage::disk('s3')->deleteDirectory($upload_folder);
            }
        }
        //In database
        RoomImages::where('room_id', $room_id)->delete();
        foreach ($images as $image) {
            $room_image = new RoomImages;
            $room_image->room_id = $room_id;
            $path = $image->store($upload_folder, 's3');
            $room_image->image_name = $path;
            $room_image->save();
        }
    }

    public function delete($room_id) {
        $upload_folder = 'uploaded/rooms/'.$room_id;
        //In folder
        $first_image = RoomImages::where('room_id', $room_id)->first();
        if($first_image != null) {
            if(Storage::disk('s3')->exists($upload_folder)) {
                Storage::disk('s3')->deleteDirectory($upload_folder);
            }
        }
        //In database
        RoomImages::where('room_id', $room_id)->delete();
    }
}