<?php
namespace App\Helpers;





use App\Models\User;
use App\Models\Room;
use App\Models\RoomRent;
use App\Models\RoomImages;
use App\Models\Breach;

use App\Models\RoomRentRegistration;

class CustomHelper{

    //<!-- Handle image

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

    

    //-->

    //<!-- Role

    public static function isAdminRole($id) {
        $isAdmin = false;
        $user = User::find($id);
        if($user->role_id == User::ROLE_ADMIN) {
            $isAdmin = true;
        }
        return $isAdmin;
    }

    //-->

    //<!-- Gender

    public function checkSameGender($renter_gender, $room_id) {
        $room_partner_id = RoomRent::where('room_id', $room_id)->value('renter_id');
        $room_partner_gender = User::find($room_partner_id)->gender;
        if(!$room_partner_gender) {
            $room_partner_gender = RoomRentRegistration::where('registered_room_id', $room_id)->first()->sender_gender;
        }
        return $renter_gender == $room_partner_gender ? true : false;
    }

    //-->

    //<!-- Lock account

    public static function lockUserAccount($id, $is_lock) {
        $user = User::find($id);
        if($is_lock) {
            $user->is_locked = User::LOCKED_ACCOUNT;
        } else {
            $user->is_locked = User::AVAILABLE_ACCOUNT;
        }
        $user->save();
        return true;
    }

    //-->

    //<!-- Breach

    public static function getBreachAllowedNumber($id) {
        return Breach::find($id)->allowed_violate_number;
    }

    //-->
}
?>