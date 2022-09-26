<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Mail\ContactUsMail;
use App\Mail\PasswordResetMail;

class ContactUsController extends Controller
{
    public function sendContactUsMessage(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50|string|regex:/^[a-zA-Z ]+$/',
            'email' => 'required|email',
            'message' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        Mail::to('boarding_house_admin@gmail.com')->send(new ContactUsMail($request->name, $request->email, $request->message));
        return response([
            'message' => 'Thank you for contacting us',
            'status' => 200,
        ]);
    }
}