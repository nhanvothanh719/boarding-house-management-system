<?php

namespace App\Http\Controllers;

use App\Helpers\CustomHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\User;

class UserController extends Controller
{
    public const avatar_public_folder = 'uploaded/avatar/';

    public function index() {
        $all_users = User::all();
        return response([
            'status' => 200,
            'allUsers' => $all_users,
        ]);
    }

    public function getUserProfile() {
        return response([
            'status' => 200,
            'currentUser' => Auth::user(),
        ]);
    }

    public function updateUserProfile(Request $request) {
        $user = Auth::user();
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|string',
            'email' => 'required|max:50|string|unique:users,email,'.$user->id,
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,phone_number,'.$user->id,
            'occupation' => 'required|max:100|string',
            'permanent_address' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->date_of_birth = $request->input('date_of_birth');
        $user->phone_number = $request->input('phone_number');
        $user->occupation = $request->input('occupation');
        $user->permanent_address = $request->input('permanent_address');
        $user->save();
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
            $upload_folder = UserController::avatar_public_folder;
            $user->profile_picture = CustomHelper::updateImage($old_avatar, $new_avatar, $upload_folder);
        }
        $user->save();
        return response([
            'message' => 'Successfully update avatar',
            'status' => 200,
        ]);
    }
}
