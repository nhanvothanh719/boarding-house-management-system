<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Mail\PasswordResetMail;

use App\Repositories\PasswordReset\PasswordResetRepositoryInterface;

class PasswordResetController extends Controller
{
    protected $reset;

    public function __construct(PasswordResetRepositoryInterface $reset) {
        $this->reset = $reset;
    }

    public function sendEmailToResetPassword(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $password_reset = $this->reset->store($request->all());
        $email = $password_reset->email;
        $token = $password_reset->token;
        Mail::to($email)->send(new PasswordResetMail($token)); //Send email to user
        return response([
            'message' => 'An email was sent. Check it to reset password',
            'status' => 200,
        ]);
    }

    public function resetPassword(Request $request) {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if (!$this->reset->checkExisted($request->all())) {
            return response([
                'message' => 'Email or pincode is wrong',
                'status' => 404,
            ]);
        }
        $password_reset = $this->reset->update($request->all());
        return response([
            'message' => 'Change password successfully',
            'status' => 200,
        ], 200);
        
    }
}
