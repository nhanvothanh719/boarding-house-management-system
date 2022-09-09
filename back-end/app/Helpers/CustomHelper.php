<?php
namespace App\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;

use App\Models\RoomStatus;
use App\Models\Role;
use App\Models\User;
use App\Models\RoomRent;
use App\Models\Balance;

use App\Mail\InvoicePaidMail;

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

    public static function checkSameGender($renter_gender, $room_id) {
        $room_partner_id = RoomRent::where('room_id', $room_id)->value('renter_id');
        $room_partner_gender = User::find($room_partner_id)->gender;
        return $renter_gender == $room_partner_gender ? true : false;
    }

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
}

?>