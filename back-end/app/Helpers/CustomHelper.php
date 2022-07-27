<?php
namespace App\Helpers;

use Illuminate\Support\Facades\File;

use App\Models\RoomStatus;
use App\Models\Role;
use App\Models\User;

class CustomHelper{

    public static function addImage($image, $upload_folder) {
        $generated_name = hexdec(uniqid());
        $extension = $image->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        if(!file_exists($upload_folder)) {
            mkdir($upload_folder);
        }
        $image->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }
    
    public static function updateImage($old_image, $new_image, $upload_folder) {
        if(!file_exists($upload_folder)) {
            mkdir($upload_folder);
        }
        //Delete existed image
        File::delete($old_image);
        //Add new image
        $generated_name = hexdec(uniqid());
        $extension = $new_image->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        $new_image->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }

    public static function getRoomStatusId($room_status) {
        $status_id = RoomStatus::where('name', $room_status)->value('id');
        return $status_id;
    }

    public static function getAdminRoleId() {
        return Role::where('name', Role::ROLE_ADMIN)->value('id');
    }

    public static function getRenterRoleId() {
        return Role::where('name', Role::ROLE_RENTER)->value('id');
    }

    public static function isAdminRole(User $user) {
        $isAdmin = false;
        if($user->role_id == CustomHelper::getAdminRoleId()) {
            $isAdmin = true;
        }
        return $isAdmin;
    }
}

?>