<?php

namespace App\Repositories\User;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use stdClass;

use Illuminate\Support\Arr;

use App\Models\User;

use App\Jobs\SendAnnouncementMail;
use App\Mail\AnnouncementMail;
use Illuminate\Database\Eloquent\Builder;

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
        $user->role = $data['role'];
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
        $user->role = $data['role'];
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
        return $user->delete();
    }

    public function getCurrentUser() {
        return Auth::user();
    }

    public function checkCanLogin($data) {
        return Auth::attempt($data);
    }

    public function checkLockedAccount($id) {
        return $this::show($id)->is_locked == User::LOCKED_ACCOUNT ? true : false;
    }

    public function checkAdmin($id) {
        return $this::show($id)->role == User::ROLE_ADMIN ? true : false;
    }

    public function generateTokenWithScope($id)
    {
        //Generate access token with scope
        if($this::checkAdmin($id)) {
            //createToken method accepts the name of the token as its first argument and an optional array of scopes
            //$user->createToken('admin_auth_token',['use-dashboard'])->accessToken;
            return $this::show($id)->createToken('admin_auth_token',['use-dashboard'])->accessToken;
        }
        return $this::show($id)->createToken('auth_token',['perform-renter-work'])->accessToken;
    }

    public function storeUserAvatar($id, $avatar) {
        $user = $this::show($id);
        $upload_folder = User::AVATAR_PUBLIC_FOLDER;
        $generated_name = hexdec(uniqid());
        $extension = $avatar->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        if(!file_exists($upload_folder)) {
            //mkdir($upload_folder);
            mkdir($upload_folder, 0777, true);
        }
        $avatar->move($upload_folder, $image_name);
        $user->profile_picture = $upload_folder.$image_name;
        $user->save();
    }

    public function updateUserAvatar($id, $old_avatar, $new_avatar) {
        $user = $this::show($id);
        $upload_folder = User::AVATAR_PUBLIC_FOLDER;
        if(!file_exists($upload_folder)) {
            //mkdir($upload_folder);
            mkdir($upload_folder, 0777, true);
        }
        //Delete existed image
        File::delete($old_avatar);
        //Add new image
        $generated_name = hexdec(uniqid());
        $extension = $new_avatar->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        $new_avatar->move($upload_folder, $image_name);
        $user->profile_picture = $upload_folder.$image_name;
        $user->save();
    }

    public function lockUserAccount($id)
    {
        $message = 'Lock account successfully';
        if($this::checkAdminRole($id)) {
            $message = 'Cannot lock account with Admin role';
            return $message;
        }
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

    public function updatePassword($email, $new_hash_password) {
        $user_id = User::where('email', $email)->value('id');
        $user = $this::show($user_id);
        $user->password = $new_hash_password;
        $user->save();
    }

    public function checkAdminRole($id)
    {
        return $this->show($id)->role == User::ROLE_ADMIN ? true : false;
    }

    public function allRenters() {
        return User::where('role', User::ROLE_RENTER)->get();
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

    public function sendAnnouncement($data) {
        $is_sent = true;
        $renters_id = $data['all_id'];
        //Send email
        foreach ($renters_id as $renter_id) {
            $renter = User::find($renter_id);
            if(!$renter) {
                $is_sent = false;
                return $is_sent;
            }
            $announcementMail = new AnnouncementMail($data['title'], $data['content']);
            $sendAnnouncementEmailJob = new SendAnnouncementMail($renter, $announcementMail);
            dispatch($sendAnnouncementEmailJob); //Push(Add) this job into queue
        }
        return $is_sent;
    }

    public function countRentersByGender() {
        $renters_count = array();
        //Get all gender values of all users
        $genders_id = User::pluck('gender')->toArray();
        //Only get unique values in array
        $genders_id = array_unique($genders_id);
        foreach($genders_id as $gender_id) {
            //stdClass is a generic 'empty' class used when casting other types to objects
            $item = new stdClass();
            if($gender_id == User::GENDER_MALE_ID){
                $item->gender = "Male";
                $item->total = User::where('gender', $gender_id)->where('role', User::ROLE_RENTER)->count();
            }
            if($gender_id == User::GENDER_FEMALE_ID){
                $item->gender = "Female";
                $item->total = User::where('gender', $gender_id)->where('role', User::ROLE_RENTER)->count();
            }
            array_push($renters_count, $item);
        }
        return $renters_count;
    }

    public function getRenterInvoices($id) {
        return $this::show($id)->invoices;
    }

    public function countRenterTotalUsedServicesAmount($id) {
        $renter_invoices = $this::show($id)->invoices;
        $invoices = array();
        foreach($renter_invoices as $invoice) {
            $services_of_invoice = array();
            foreach($invoice->services as $service) {
                $item = new stdClass();
                $item->service_name = $service->service->name;
                $item->total = $service->quantity;
                array_push($services_of_invoice, $item);
            }
            array_push($invoices, $services_of_invoice);
        }
        // Arr::collapses -> Collapses an array of arrays into a single array
        $all_services = Arr::collapse($invoices);

        $unique_services = collect($all_services)->unique('service_name')->values()->all();
        $unique_service_names = array();
        foreach($unique_services as $service) {
            array_push($unique_service_names, $service->service_name);
        }
        $services_count = array();
        foreach($unique_service_names as $name) {
            $item = new stdClass();
            $item->service_name = $name; 
            $total_use = 0;
            foreach($all_services as $service) {
                if($service->service_name == $name) {
                    $total_use = $total_use + $service->total;
                }
            }
            $item->total = $total_use;
            array_push($services_count, $item);
        }
        return $services_count;
    }

    public function getUniqueRenterBreachHistoriesByBreach($id) {
        $renter_breach_histories = $this::show($id)->breach_histories;
        $unique_breach_histories = collect($renter_breach_histories)->unique('breach_id')->values()->all();
        return $unique_breach_histories;
    }

    public function getRenterBreachHistories($id) {
        $unique_breach_histories = $this::getUniqueRenterBreachHistoriesByBreach($id);
        $breaches_total = array();
        foreach($unique_breach_histories as $breach_history) {
            $breach = new stdClass;
            $breach->id = $breach_history->breach->id;
            $breach->name = $breach_history->breach->name;
            $breach->severity_level = $breach_history->breach->severity_level;
            $breach->allowed_violate_number = $breach_history->breach->allowed_violate_number;
            $breach->description = $breach_history->breach->description;
            $breach_id = $breach_history->breach->id;
            $breach->total = User::withCount([
                'breach_histories' => function ($query) use($breach_id) {
                    $query->where('breach_id', $breach_id);
                }])->where('id', $id)->get()[0]->breach_histories_count;
            array_push($breaches_total, $breach);
        }
        return $breaches_total;
    }

    public function countRenters() {
        return User::where('role', User::ROLE_RENTER)->count();
    }
}