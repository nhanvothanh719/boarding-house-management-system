<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ContactUs;

class ContactUsController extends Controller
{
    public function sendContactUsMessage(Request $request){
        $receivedData = json_decode($request->getContent(), true);
        $name = $receivedData['name'];
        $email = $receivedData['email'];
        $message = $receivedData['message'];
        
        $result = ContactUs::insert([
            'name' => $name,
            'email' => $email,
            'message' => $message
        ]);
        if($result == true){
            return 1;
        } else {
            return 0;
        }
    }
}
