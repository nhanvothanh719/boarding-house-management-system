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
use App\Models\Motorbike;

class MotorbikeController extends Controller
{
    public const motorbike_image_public_folder = 'uploaded/motorbikes/';

    public function index() {
        $all_motorbikes = Motorbike::all();
        return response([
            'status' => 200,
            'allMotorbikes' => $all_motorbikes,
        ]);
    }

    public function getMotorbikeOwners() {
        $all_owners_id = DB::table('motorbikes')->pluck('user_id');
        $motorbike_owners = array();
        foreach ($all_owners_id as $owner_id) {
            $owner = User::find($owner_id);
            array_push($motorbike_owners, $owner);
        }
        return response([
            'status' => 200,
            'allOwners' => $motorbike_owners,
        ]);
    }

    public function deleteMotorbike($id) {
        $motorbike = Motorbike::find($id);
        if($motorbike) {
            File::delete($motorbike->motorbike_image);
            $motorbike->delete();
            return response([
                'message' => 'Successfully delete renter',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
    }

    public function storeMotorbike(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|unique:motorbikes',
            'license_plate' => 'required|min:6|max:10|unique:motorbikes',
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
            $motorbike = new Motorbike;
            $motorbike->user_id = $request->input('user_id');
            $motorbike->license_plate = $request->input('license_plate');
            if($request->hasFile('motorbike_image')) {
                $image = $request->file('motorbike_image');
                $upload_folder = MotorbikeController::motorbike_image_public_folder;
                $motorbike->motorbike_image = CustomHelper::addImage($image, $upload_folder);
            }
            $motorbike->save();
            return response([
                'message' => 'Create new motorbike successfully',
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

    public function editMotorbike($id) {
        $motorbike = Motorbike::find($id);
        if($motorbike) {
            return response([
                'status' => 200,
                'motorbike' => $motorbike,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No motorbike found',
            ]);
        }
    }

    public function updateMotorbike(Request $request, $id) {
        $user = User::find($request->input('user_id'));
        if(!$user) {
            return response([
                'message' => 'No person with provided ID found',
                'status' => 404, //Unprocessable entity
            ]);
        }
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|unique:motorbikes,user_id,'.$id,
            'license_plate' => 'required|min:6|max:10|unique:motorbikes,license_plate,'.$id,
            'motorbike_image' => 'image',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $motorbike = Motorbike::find($id);
        if($motorbike) {
            $motorbike->user_id = $request->input('user_id');
            $motorbike->license_plate = $request->input('license_plate');
            if($request->hasFile('motorbike_image')) {
                $new_image = $request->file('motorbike_image');
                $old_image = $motorbike->motorbike_image;
                $upload_folder = MotorbikeController::motorbike_image_public_folder;
                $motorbike->motorbike_image = CustomHelper::updateImage($old_image, $new_image, $upload_folder);
            }
            $motorbike->save();
            return response([
                'message' => 'Successfully update motorbike',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No motorbike found',
                'status' => 404,
            ]);
        }
    }
}
