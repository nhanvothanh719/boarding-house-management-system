<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use App\Models\User;

use App\Http\Requests\InputEmailRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Mail\PasswordResetMail;

class PasswordResetController extends Controller
{
    public function sendEmailToResetPassword(InputEmailRequest $request) {
        $email = $request->email;
        if(User::where('email', $email)->doesntExist()) {
            return response([
                'message' => 'Input email does not exist',
                'status' => 404,
            ]);
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
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
    }

    public function resetPassword(ResetPasswordRequest $request) {
        $email = $request->email;
        $token = $request->token;
        $new_password = Hash::make($request->password);
        $check_email = DB::table('password_resets')->where('email', $email)->first();
        $check_token = DB::table('password_resets')->where('token', $token)->first();

        if (!$check_email) {
            return response([
                'message' => 'Email does not exist',
                'status' => 404,
            ]);
        }

        if (!$check_token) {
            return response([
                'message' => 'Invalid pincode (token)',
                'status' => 404,
            ]);
        }

        try {
            DB::table('users')->where('email', $email)->update(['password' => $new_password]);
            DB::table('password_resets')->where('email', $email)->delete();
            return response([
                'message' => 'Change password successfully',
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
        
    }
}
