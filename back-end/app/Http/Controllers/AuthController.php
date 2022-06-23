<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request) {
        try {
            if(Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                $token = $user->createToken('app')->accessToken; //Generate token
                return response([
                    'message' => 'Login successfully!',
                    'token' => $token,
                    'user' => $user, //User data
                ], 200); //OK
            }
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
        return response([
            'message' => 'Invalid email or password',
        ], 401); //Unauthorized
    }
}
