<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

use App\Mail\FirstPasswordChangeMail;

use App\Repositories\User\UserRepositoryInterface;

class UserController extends Controller
{
    protected $user;

    public function __construct(UserRepositoryInterface $user) {
        $this->user = $user;
    }

    public function index() {
        return response([
            'status' => 200,
            'allUsers' => $this->user->all(),
        ]);
    }

    public function getUserProfile() {
        return response([
            'status' => 200,
            'currentUser' => Auth::user(),
        ]);
    }

    public function storeUser(Request $request) {
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'email' => 'required|unique:users|max:50|email',
            'gender' => 'required',
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'id_card_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users',
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users',
            'occupation' => 'required|max:100|regex:/^[a-zA-Z ]+$/',
            'permanent_address' => 'required',
            'profile_picture' => 'image',
            'role' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $user_avatar = null;
        $generated_password = 'password';
        if($request->hasFile('profile_picture')) {
            $user_avatar = $request->file('profile_picture');
        }
        $user = $this->user->store($request->all(), $generated_password, $user_avatar);
        Mail::to($user->email)->send(new FirstPasswordChangeMail($generated_password));
        return response([
            'message' => 'Create new user successfully',
            'status' => 200,
        ]);
    }

    public function editUser($id) {
        $user = $this->user->show($id);
        if($user) {
            //Change to user
            return response([
                'status' => 200,
                'user' => $user,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No user found',
            ]);
        }
    }

    public function updateUser(Request $request, $id) {
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|string|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'email' => 'required|max:50|string|email|unique:users,email,'.$id,
            'gender' => 'required',
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'id_card_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,id_card_number,'.$id,
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,phone_number,'.$id,
            'occupation' => 'required|max:100|string|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'permanent_address' => 'required',
            'profile_picture' => 'image',
            'role' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $user = $this->user->show($id);
        if($user) {
            $user = $this->user->update($request->all(), $user->id);
            $user = $this->user->updateImportantInfo($request->all(), $user->id);
            if($request->hasFile('profile_picture')) {
                $new_avatar = $request->file('profile_picture');
                $old_avatar = $user->profile_picture;
                $this->user->updateUserAvatar($user->id, $old_avatar, $new_avatar);
            }
            return response([
                'message' => 'Successfully update user',
                'status' => 200,
            ]);
        }
        return response([
            'message' => 'No user found',
            'status' => 404,
        ]);
    }

    public function updateUserProfile(Request $request) {
        $user = Auth::user();
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|string|regex:/^[a-zA-Z ]+$/',
            'email' => 'required|max:50|string|email|unique:users,email,'.$user->id,
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,phone_number,'.$user->id,
            'occupation' => 'required|max:100|string|regex:/^[a-zA-Z ]+$/',
            'permanent_address' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $user = $this->user->update($request->all(), $user->id);
        return response([
            'message' => 'Successfully update user profile',
            'status' => 200,
        ]);
    }

    public function updateUserAvatar(Request $request) {
        $validator = Validator::make($request->all(), [
            'profile_picture' => 'required|image',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $user = Auth::user();
        if($request->hasFile('profile_picture')) {
            $new_avatar = $request->file('profile_picture');
            $old_avatar = $user->profile_picture;
            $this->user->updateUserAvatar($user->id, $old_avatar, $new_avatar);
        }
        return response([
            'message' => 'Successfully update avatar',
            'status' => 200,
        ]);
    }

    public function deleteUser($id) {
        $user = $this->user->show($id);
        if($user) {
            $this->user->delete($id);
            return response([
                'status' => 200,
                'message' => 'Successfully delete user',
            ]);
        }
        return response([
            'message' => 'No user found',
            'status' => 404,
        ]);
    }

    public function lockUserAccount($id) {
        $user = $this->user->show($id);
        if(!$user) {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        $is_lock_successful = $this->user->lockUserAccount($id);
        if($is_lock_successful) {
            return response([
                'message' => 'Update status of account successfully',
                'status' => 200,
            ]);
        } 
        return response([
            'message' => 'Cannot lock account with admin role',
            'status' => 400,
        ]);
    }

    public function checkCanCreateInvoice($id) {
        if(!$this->user->checkHasRoom($id)) {
            return response([
                'message' => 'Cannot create invoice for renter without having room',
                'status' => 400,
            ]);
        }
        return response([
            'status' => 200,
        ]);
    }

    public function getRoomPrice($id) {
        $room_price = $this->user->getRoomPrice($id);
        return response([
            'status' => 200,
            'price' => $room_price,
        ]);
    }

    public function getRenterRoomPrice() {
        $room_price = $this->user->getRoomPrice(Auth::user()->id);
        return response([
            'status' => 200,
            'price' => $room_price,
        ]);
    }

}
