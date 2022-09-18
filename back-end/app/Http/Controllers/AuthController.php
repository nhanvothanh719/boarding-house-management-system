<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    public function login(Request $request) {
        try {
            if(Auth::attempt($request->only('email', 'password'))) {
                $is_admin = false;
                $user = Auth::user();
                if($user->is_locked === User::LOCKED_ACCOUNT) {
                    return response([
                        'status' => 403,
                        'message' => 'This account is temporary locked',
                    ]);
                }
                //Generate access token
                //If user logins with Admin role
                if($user->role_id == User::ROLE_ADMIN) 
                {
                    //Generate access token with scope
                    //createToken method accepts the name of the token as its first argument and an optional array of scopes
                    $auth_token = $user->createToken('admin_auth_token',['use-dashboard'])->accessToken;
                    $is_admin = true;
                }
                else {
                    $auth_token = $user->createToken('auth_token',['perform-renter-work'])->accessToken;
                    $is_admin = false;
                }
                return response([
                    'message' => 'Login successfully',
                    'token' => $auth_token,
                    'user' => $user, //User data
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
            'status' => 401,
            'message' => 'Incorrect email or password',
        ]); //Unauthorized
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
