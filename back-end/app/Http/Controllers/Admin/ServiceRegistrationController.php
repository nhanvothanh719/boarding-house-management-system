<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Service;
use App\Models\User;
use App\Models\ServiceRegistration;

class ServiceRegistrationController extends Controller
{
    public function index() {
        $all_registrations = ServiceRegistration::all();
        return response([
            'status' => 200,
            'allRegistrations' => $all_registrations,
        ]);
    }

    public function registerService(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'service_id' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $user = User::find($request->user_id);
        if(!$user) {
            return response([
                'message' => 'Cannot register due to no renter found',
                'status' => 404,
            ]);
        }
        $renter_check = $user->role_id === 1 ? true : false;
        if(!$renter_check) {
            return response([
                'message' => 'Cannot register as the user is not the renter',
                'status' => 404,
            ]);
        }
        $check_existed_registration = ServiceRegistration::where([['user_id', $user->id],['service_id', $request->service_id]])->count();
        if($check_existed_registration > 0) {
            return response([
                'message' => 'This renter has already registered to use this service',
                'status' => 404,
            ]);
        }
        try {
            ServiceRegistration::create([
                'user_id' => $request->user_id,
                'service_id' => $request->service_id,
            ]);
            return response([
                'message' => 'Successfully create new service registration',
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
                'status' => 400,
            ], 400);
        }
    }

    public function unregisterService($id) {
        $registration = ServiceRegistration::find($id);
        if($registration) {
            $registration->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully remove registration',
            ]);
        } else {
            return response([
                'message' => 'No registration found',
                'status' => 404,
            ]);
        }
    }
}
