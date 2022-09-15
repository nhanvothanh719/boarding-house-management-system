<?php
namespace App\Helpers;

use Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;

use App\Models\RoomStatus;
use App\Models\Role;
use App\Models\User;
use App\Models\Room;
use App\Models\RoomRent;
use App\Models\RoomImages;
use App\Models\Balance;

use App\Mail\InvoicePaidMail;

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

    public static function storeRoomImages($files, $room_id) {
        $room_number = Room::find($room_id)->number;
        $upload_folder = 'uploaded/rooms/'.$room_number.'/';
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
        return true;
    }

    public static function updateRoomImages($files, $room_id) {
        $room_number = Room::find($room_id)->number;
        $upload_folder = 'uploaded/rooms/'.$room_number.'/';
        //Delete existed images:
        //In folder
        if(File::exists($upload_folder)) {
            $images = RoomImages::where('room_id', $room_id)->pluck('image_name');
            foreach ($images as $image) {
                unlink($image);
            }
        }
        //In database
        RoomImages::where('room_id', $room_id)->delete();
        //Store new images
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
        return true;
    }

    public static function deleteRoomImages($room_id) {
        $room_number = Room::find($room_id)->number;
        $upload_folder = 'uploaded/rooms/'.$room_number.'/';
        //In folder
        File::deleteDirectory(public_path($upload_folder));
        //In database
        RoomImages::where('room_id', $room_id)->delete();
        return true;
    }

    //-->

    //<!-- Room status

    public static function getRoomStatusId($room_status) {
        return RoomStatus::where('name', $room_status)->value('id');
    }

    public static function getEmptyStatusId() {
        return RoomStatus::where('name', RoomStatus::STATUS_EMPTY)->value('id');
    }

    public static function getOccupiedStatusId() {
        return RoomStatus::where('name', RoomStatus::STATUS_OCCUPIED)->value('id');
    }

    public static function getFullStatusId() {
        return RoomStatus::where('name', RoomStatus::STATUS_FULL)->value('id');
    }

    //-->

    //<!-- Role

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

    //-->

    //<!-- Gender

    public static function checkSameGender($renter_gender, $room_id) {
        $room_partner_id = RoomRent::where('room_id', $room_id)->value('renter_id');
        $room_partner_gender = User::find($room_partner_id)->gender;
        return $renter_gender == $room_partner_gender ? true : false;
    }

    //-->

    //<!-- Payment

    public static function handleAfterPayment($invoice_info, $user_id, $invoice_id) {
        //Automatically add income
        $balance = Balance::create([
            'description' => 'Income from invoice with ID: '.$invoice_id,
            'is_income' => 1,
            'amount' => $invoice_info->amount,
            'occurred_on' => date('Y-m-d', strtotime(' +0 day')),
        ]);
        //Send email confirmation
        $renter_email = User::find($user_id)->email;
        Mail::to($renter_email)->send(new InvoicePaidMail(
            $invoice_info->month,
            $invoice_info->year,
            $invoice_info->amount,
            $invoice_info->payment_method
        ));
        return $balance;
    }

    //-->
}

?>