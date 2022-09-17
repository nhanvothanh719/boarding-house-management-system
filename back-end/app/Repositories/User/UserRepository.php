<?php

namespace App\Repositories\User;

use App\Helpers\CustomHelper;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    public function all() {
        return User::all();
    }

    public function show($id) {
        return User::with('breach_histories')->find($id);
    }

    public function store($data, $generated_password, $avatar = null) {
        $user = new User;
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->gender = $data['gender'];
        $user->date_of_birth = $data['date_of_birth'];
        $user->id_card_number = $data['id_card_number'];
        $user->phone_number = $data['phone_number'];
        $user->occupation = $data['occupation'];
        $user->permanent_address = $data['permanent_address'];
        $user->role_id = $data['role_id'];
        $user->password = Hash::make($generated_password);
        $user->save();
        //Store avatar
        if($avatar != null) {
            $this::storeUserAvatar($user->id, $avatar);
        }
        return $user;
    }

    public function update($data, $id) {
        $user = $this::show($id);
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->date_of_birth = $data['date_of_birth'];
        $user->phone_number = $data['phone_number'];
        $user->occupation = $data['occupation'];
        $user->permanent_address = $data['permanent_address'];
        $user->save();
        return $user;
    }

    public function updateImportantInfo($data, $id) {
        $user = $this::show($id);
        $user->gender = $data['gender'];
        $user->id_card_number = $data['id_card_number'];
        $user->role_id = $data['role_id'];
        $user->save();
        return $user;
    }

    public function delete($id) {
        $user = User::with('motorbike')->find($id);
        $motorbike = $user->motorbike;
        if($motorbike) {
            $motorbike_image = $user->motorbike->motorbike_image;
            if($motorbike_image) {
                File::delete($motorbike_image);
            }
            $user->motorbike()->delete();
        }
        foreach($user->invoices as $invoice) {
            $invoice->services()->delete();
        }
        $user->payment_histories()->delete();
        $user->invoices()->delete();
        $user->breach_histories()->delete();
        $user->room_rent()->delete();
        $user->room_contract()->delete();
        $user->problems()->delete();
        $user->service_registrations()->delete();
        $user->password_reset_histories()->delete();
        File::delete($user->profile_picture);
        $user->delete();
    }

    public function getCurrentUser() {
        return Auth::user();
    }

    public function storeUserAvatar($id, $avatar) {
        $user = $this::show($id);
        $upload_folder = User::AVATAR_PUBLIC_FOLDER;
        $user->profile_picture = CustomHelper::addImage($avatar, $upload_folder);
        $user->save();
    }

    public function updateUserAvatar($id, $old_avatar, $new_avatar) {
        $user = $this::show($id);
        $upload_folder = User::AVATAR_PUBLIC_FOLDER;
        $user->profile_picture = CustomHelper::updateImage($old_avatar, $new_avatar, $upload_folder);
        $user->save();
    }

    public function lockUserAccount($id)
    {
        $message = 'Lock account successfully';
        $user = $this::show($id);
        if($user->is_locked == User::LOCKED_ACCOUNT) {
            $user->is_locked = User::AVAILABLE_ACCOUNT;
            $message = 'Unlock account successfully';
        } else {
            $user->is_locked = User::LOCKED_ACCOUNT;
        }
        $user->save();
        return $message;
    }

    public function allRenters() {
        return User::where('role_id', User::ROLE_RENTER)->get();
    }

    public function getBreachHistories($id) {
        return $this::show($id)->breach_histories;
    }

    public function getRegisteredServices($id) {
        $registered_services = array();
        foreach($this::show($id)->service_registrations as $registration) {
            $registration->service->quantity = 0;
            array_push($registered_services, $registration->service);
        }
        return $registered_services;
    }
}