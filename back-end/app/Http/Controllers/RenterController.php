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
}
