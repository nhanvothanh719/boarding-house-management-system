<?php

namespace App\Http\Controllers;

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
}
