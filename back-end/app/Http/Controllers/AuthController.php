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
                $user = Auth::user();
                $token = $user->createToken('auth_token')->accessToken; //Generate token
                return response([
                    'message' => 'Login successfully',
                    'token' => $token,
                    'user' => $user, //User data
                    'token_type' => 'Bearer',
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

    public function register(RegisterRequest $request) {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'id_card_number' => $request->id_card_number,
                'phone_number' => $request->phone_number,
                'occupation' => $request->occupation,
                'permanent_address' => $request->permanent_address,
            ]);
            return response([
                'message' => 'Register successfully',
                'user' => $user,
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
        ], 200); //OK
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400);
        }
    }

    
}
