<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class UserController extends Controller
{
    public function index() {
        $all_users = User::all();
        return response([
            'status' => 200,
            'allUsers' => $all_users,
        ]);
    }

    public function getUser() {
        return Auth::user();
    }

    public function getName($id) {
        $name = User::where('id', $id)->value('name');
        if($name) {
            return response([
                'name' => $name,
                'status' => 200,
            ]);
        }
        return response([
            'message' => 'This person can be found',
            'status' => 404,
        ]);
    }
}
