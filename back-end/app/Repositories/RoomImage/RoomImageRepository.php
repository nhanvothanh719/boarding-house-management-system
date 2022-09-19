<?php

namespace App\Repositories\RoomImage;

use App\Models\RoomImages;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;

class RoomImageRepository implements RoomImageRepositoryInterface
{
    public function store($files, $room_id) {
        $upload_folder = 'uploaded/rooms/'.$room_id.'/';
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
            $room_image->room_id = $room_id;
            $room_image->image_name = $image;
            $room_image->save();
        }
    }

    public function update($files, $room_id) {
        //Delete existed images:
        //In folder
        $upload_folder = 'uploaded/rooms/'.$room_id.'/';
        if(File::exists($upload_folder)) {
            $images = RoomImages::where('room_id', $room_id)->pluck('image_name');
            foreach ($images as $image) {
                unlink($image);
            }
        }
        //In database
        RoomImages::where('room_id', $room_id)->delete();
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
            $room_image->room_id = $room_id;
            $room_image->image_name = $image;
            $room_image->save();
        }
    }

    public function delete($room_id) {
        $upload_folder = 'uploaded/rooms/'.$room_id.'/';
        //In folder
        File::deleteDirectory(public_path($upload_folder));
        //In database
        RoomImages::where('room_id', $room_id)->delete();
    }
}