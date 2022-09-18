<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Repositories\User\UserRepositoryInterface;

class AuthController extends Controller
{
    protected $user;

    public function __construct(UserRepositoryInterface $user) {
        $this->user = $user;
    }

    public function login(Request $request) {
        //if(Auth::attempt($request->only('email', 'password'))) {
        if($this->user->checkCanLogin($request->only('email', 'password'))) {
            $user = $this->user->getCurrentUser();
            if($this->user->checkLockedAccount($user->id)) {
                return response([
                    'status' => 403,
                    'message' => 'This account is temporary locked',
                ]);
            }
            $is_admin = $this->user->checkAdmin($user->id);
            $auth_token = $this->user->generateTokenWithScope($user->id);
            return response([
                'message' => 'Login successfully',
                'token' => $auth_token,
                'user' => $user, //User data
                'isAdmin' => $is_admin,
                'status' => 200, //OK
            ]); 
        }
        return response([
            'status' => 401,
            'message' => 'Incorrect email or password',
        ]); //Unauthorized
    }
    
    public function logout() {
        auth()->user()->tokens()->delete();
        return response([
            'message' => 'Log out successfully',
            'status' => 200,
        ]);
    }
}
