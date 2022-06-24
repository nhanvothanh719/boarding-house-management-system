<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

use App\Http\Requests\PasswordResetRequest;
use App\Mail\PasswordResetMail;

class PasswordResetController extends Controller
{
    public function passwordReset(PasswordResetRequest $request) {
        $email = $request->email;
        if(User::where('email', $email)->doesntExist()) {
            return response([
                'message' => 'Input email does not exist',
            ], 401);
        }
        //Generate random token
        $token = rand(10, 1000);

        try {
            DB::table('password_resets')->insert([
                'email' => $email,
                'token' => $token,
            ]);
            Mail::to($email)->send(new PasswordResetMail($token)); //Send email to user
            return response([
                'message' => 'An email was sent. Check it to reset password',
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
    }
}
