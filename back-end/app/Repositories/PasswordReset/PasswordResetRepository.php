<?php

namespace App\Repositories\PasswordReset;

use App\Helpers\CustomHelper;

use App\Models\PasswordReset;

use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class PasswordResetRepository implements PasswordResetRepositoryInterface 
{
    private $user_repository;

    public function __construct(UserRepositoryInterface $user_repository) 
    {
        $this->user_repository = $user_repository;
    }

    public function store($data)
    {
        $password_reset = new PasswordReset;
        //Generate random token
        $token = rand(10, 1000);
        $password_reset->email = $data['email'];
        $password_reset->token = $token;
        $password_reset->save();
        return $password_reset;
    }

    public function update($data) {
        $new_hash_password = Hash::make($data['password']);
        $email = $data['email'];
        $this->user_repository->updatePassword($email, $new_hash_password);
        PasswordReset::where('email', $email)->delete();
    }

    public function checkExisted($data) {
        $is_existed = false;
        if(PasswordReset::where('email', $data['email'])->where('token', $data['token'])->first()) {
            $is_existed = true;
        }
        return $is_existed;
    }
}