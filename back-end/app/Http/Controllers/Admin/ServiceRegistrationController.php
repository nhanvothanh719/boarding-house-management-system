<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\CustomHelper;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\ServiceRegistration\ServiceRegistrationRepositoryInterface;

class ServiceRegistrationController extends Controller
{
    protected $service_registration;

    public function __construct(ServiceRegistrationRepositoryInterface $service_registration) {
        $this->service_registration = $service_registration;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRegistrations' => $this->service_registration->all(),
        ]);
    }

    public function registerService(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($this->service_registration->checkAdminRole($request->user_id)) {
            return response([
                'message' => 'Cannot register since the user is not renter',
                'status' => 400,
            ]);
        }
        $check_existed_registration = $this->service_registration->checkExisted($request->user_id, $request->service_id);
        if($check_existed_registration) {
            return response([
                'message' => 'This renter has already registered to use this service',
                'status' => 400,
            ]);
        }
        $service_registration = $this->service_registration->store($request->all());
        return response([
            'message' => 'Successfully create new service registration',
            'status' => 200,
        ]);
    }

    public function unregisterService($id) {
        $registration = $this->service_registration->show($id);
        if(!$registration) {
            return response([
                'message' => 'No registration found',
                'status' => 404,
            ]);
        }
        $this->service_registration->delete($id);
        return response([
            'status' => 200,
            'message' => 'Successfully remove service registration',
        ]);
    }
}
