<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Image;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\File; 

use App\Models\User;
use App\Models\Motorbike;

class RenterController extends Controller
{
    public function index() {
        $allRenters = User::where('role_id', 1)->get();
        return response([
            'status' => 200,
            'allRenters' => $allRenters,
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
            'license_plate' => 'min:6|max:10|unique:motorbikes',
            'profile_picture' => 'image',
            'motorbike_image' => 'image',
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
            $renter->password = 'password';
            $renter->gender = $request->input('gender');
            $renter->date_of_birth = $request->input('date_of_birth');
            $renter->id_card_number = $request->input('id_card_number');
            $renter->phone_number = $request->input('phone_number');
            $renter->occupation = $request->input('occupation');
            $renter->permanent_address = $request->input('permanent_address');
            $renter->role_id = $request->input('role_id');
            if($request->hasFile('profile_picture')) {
                $image = $request->file('profile_picture');
                $renter->profile_picture = RenterController::handleAvatar($image);
            }
            $renter->save();
            if($request->hasFile('motorbike_image')) {
                if(!$request->input('license_plate')) {
                    return response([
                        'message' => 'Cannot add due to the null license plate field',
                        'status' => 404,
                    ]);
                }
                $motorbike = new Motorbike;
                $motorbike->user_id = User::where('id_card_number', $request->input('id_card_number'))->value('id');
                $motorbike->license_plate = $request->input('license_plate');
                $image = $request->file('motorbike_image');
                $motorbike->motorbike_image = RenterController::handleMotorbikeImage($image);
                $motorbike->save();
            }
            //Todo: Send email to notify 
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

    public function handleAvatar($image) {
        $generated_name = hexdec(uniqid());
        $extension = $image->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        $upload_folder = 'uploaded/avatar/';
        if(!file_exists($upload_folder)) {
            mkdir($upload_folder);
        }
        $image->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }

    public function handleMotorbikeImage($image) {
        $generated_name = hexdec(uniqid());
        $extension = $image->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        $upload_folder = 'uploaded/motorbikes/';
        if(!file_exists($upload_folder)) {
            mkdir($upload_folder);
        }
        $image->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }
}
