<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Models\ContactUs;

use App\Mail\ContactUsMail;
use App\Mail\PasswordResetMail;

class ContactUsController extends Controller
{
    public function sendContactUsMessage(Request $request){
        try {
            $receivedData = json_decode($request->getContent(), true);
            $name = $receivedData['name'];
            $email = $receivedData['email'];
            $message = $receivedData['message'];
        
            $result = ContactUs::insert([
                'name' => $name,
                'email' => $email,
                'message' => $message
            ]);
            Mail::to($email)->send(new ContactUsMail($name, $email, $message));
            return response([
                'message' => 'Thank you for contacting us',
            ], 200); //OK
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
            ], 400); //Bad request
        }
    }
}