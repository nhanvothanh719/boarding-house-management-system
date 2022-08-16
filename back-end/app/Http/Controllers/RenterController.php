<?php

namespace App\Http\Controllers;

use App\Helpers\CustomHelper;

use Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail; 
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Role;
use App\Models\Motorbike;

use App\Mail\FirstPasswordChangeMail;

class RenterController extends Controller
{
    public const avatar_public_folder = 'uploaded/avatar/';

    public function index() {
        $all_renters = User::where('role_id', CustomHelper::getRenterRoleId())->get();
        return response([
            'status' => 200,
            'allRenters' => $all_renters,
        ]);
    }

    public function storeRenter(Request $request) {
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50',
            'email' => 'required|unique:users|max:50',
            'gender' => 'required',
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'id_card_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users',
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users',
            'occupation' => 'required|max:100',
            'permanent_address' => 'required',
            'profile_picture' => 'image',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        try {
            $renter = new User;
            $renter->name = $request->input('name');
            $renter->email = $request->input('email');
            //Todo: Create initial password --> Random
            $generated_password = Str::random(10);
            $renter->password = Hash::make($generated_password);
            //
            $renter->gender = $request->input('gender');
            $renter->date_of_birth = $request->input('date_of_birth');
            $renter->id_card_number = $request->input('id_card_number');
            $renter->phone_number = $request->input('phone_number');
            $renter->occupation = $request->input('occupation');
            $renter->permanent_address = $request->input('permanent_address');
            $renter->role_id = $request->input('role_id');
            if($request->hasFile('profile_picture')) {
                $image = $request->file('profile_picture');
                $upload_folder = RenterController::avatar_public_folder;
                $renter->profile_picture = CustomHelper::addImage($image, $upload_folder);
            }
            $renter->save();
            $token = rand(10, 1000);
            DB::table('password_resets')->insert([
                'email' => $request->input('email'),
                'token' => $token,
            ]);
            Mail::to($renter->email)->send(new FirstPasswordChangeMail($generated_password, $token));
            return response([
                'message' => 'Create new renter successfully',
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
                'status' => 400,
            ], 400);
        }
    }

    public function editRenter($id) {
        $renter = User::find($id);
        if($renter) {
            return response([
                'status' => 200,
                'renter' => $renter,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No renter found',
            ]);
        }
    }

    public function updateRenter(Request $request, $id) {
        $before_appropriate_time = date('Y-m-d', strtotime(' -18 year'));
        $after_appropriate_time = date('Y-m-d', strtotime(' -40 year'));
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|string',
            'email' => 'required|max:50|string|unique:users,email,'.$id,
            'gender' => 'required',
            'date_of_birth' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
            'id_card_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,id_card_number,'.$id,
            'phone_number' => 'required|regex:/^([0-9\s\-\+\(\)]*)$/|size:10|unique:users,phone_number,'.$id,
            'occupation' => 'required|max:100|string',
            'permanent_address' => 'required',
            'profile_picture' => 'image',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $renter = User::find($id);
        if($renter) {
            $renter->name = $request->input('name');
            $renter->email = $request->input('email');
            $renter->gender = $request->input('gender');
            $renter->date_of_birth = $request->input('date_of_birth');
            $renter->id_card_number = $request->input('id_card_number');
            $renter->phone_number = $request->input('phone_number');
            $renter->occupation = $request->input('occupation');
            $renter->permanent_address = $request->input('permanent_address');
            $renter->role_id = $request->input('role_id');
            if($request->hasFile('profile_picture')) {
                $new_avatar = $request->file('profile_picture');
                $old_avatar = $renter->profile_picture;
                $upload_folder = RenterController::avatar_public_folder;
                $renter->profile_picture = CustomHelper::updateImage($old_avatar, $new_avatar, $upload_folder);
            }
            $renter->save();
            return response([
                'message' => 'Successfully update room',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No room ID found',
                'status' => 404,
            ]);
        }
    }

    public function deleteRenter($id) {
        $renter = User::find($id);
        if($renter) {
            //Delete motorbike
            $motorbike_id = Motorbike::where('user_id', $id)->value('id');
            $motorbike = Motorbike::find($motorbike_id);
            if($motorbike) {
                File::delete($motorbike->motorbike_image);
                $motorbike->delete();
            }
            File::delete($renter->profile_picture);
            $renter->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete renter',
            ]);
        } else {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
    }

    public function lockRenterAccount($id) {
        $user = User::find($id);
        if($user->role_id == Role::ROLE_ADMIN){
            return response([
                'message' => 'Cannot lock account of user with admin role',
                'status' => 404,
            ]);
        }
        if($user->is_locked == User::LOCKED_ACCOUNT) {
            $user->is_locked = User::AVAILABLE_ACCOUNT;
            $user->save();
            return response([
                'message' => 'Unlock account successfully',
                'status' => 200,
            ]);
        }
        $user->is_locked = User::LOCKED_ACCOUNT;
        $user->save();
        return response([
            'message' => 'Lock account successfully',
            'status' => 200,
        ]);
    }
}
