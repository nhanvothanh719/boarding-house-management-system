<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Role;

use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    public function login(Request $request) {
        try {
            if(Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                //Generate access token
                //If user logins with Admin role
                if($user->role_id == 0) 
                {
                    //Generate access token with scope
                    $auth_token = $user->createToken('auth_token',['admin'])->accessToken;
                    $is_admin = true;
                }
                else {
                    $auth_token = $user->createToken('auth_token')->accessToken;
                    $is_admin = false;
                }
                
                return response([
                    'message' => 'Login successfully',
                    'token' => $auth_token,
                    'user' => $user, //User data
                    'tokenType' => 'Bearer',
                    'isAdmin' => $is_admin,
                    'status' => 200,
                ], 200); //OK
            }
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
        return response([
            'message' => 'Incorrect email or password',
        ], 401); //Unauthorized
    }

    public function register(Request $request) {
        try {
            $renter_role_id = Role::where('name', Role::ROLE_ADMIN)->value('id');
            //$renter_role_id = 1;
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role_id' => $renter_role_id,
                'password' => Hash::make($request->password),
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'id_card_number' => $request->id_card_number,
                'phone_number' => $request->phone_number,
                'occupation' => $request->occupation,
                'permanent_address' => $request->permanent_address,
            ]);
            //$token = $user->createToken('auth_token')->accessToken;
            return response([
                'message' => 'Register successfully',
                'user' => $user,
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400);
        }
    }

    public function logout() {
        try {
        auth()->user()->tokens()->delete();
        return response([
            'message' => 'Log out successfully',
            'status' => 200,
        ], 200); //OK
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400);
        }
    }
}
