<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Service;
use App\Models\User;
use App\Models\ServiceRegistration;

class ServiceController extends Controller
{
    public function index() {
        $all_services = Service::all();
        return response([
            'status' => 200,
            'allServices' => $all_services,
        ]);
    }

    public function storeService(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:services|max:100|string|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'unit' => 'required|max:50',
            'unit_price' => 'required|numeric|min:0.5|max:50',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        try {
            $service = Service::create([
                'name' => $request->name,
                'description' => $request->description,
                'is_compulsory' => $request->is_compulsory == true ? '1' : '0',
                'unit' => $request->unit,
                'unit_price' => $request->unit_price,
            ]);
            return response([
                'message' => 'Successfully create new service',
                'service' => $service,
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

    public function getOptionalServices() {
        $optional_services = Service::where('is_compulsory', 0)->get();
        return response([
            'status' => 200,
            'allOptionalServices' => $optional_services,
        ]);
    }

    public function editService($id) {
        $service = Service::find($id);
        if($service) {
            return response([
                'status' => 200,
                'service' => $service,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No service found',
            ]);
        }
    }

    public function updateService(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => ['required','regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/','unique:services,name,'.$id],
            'unit' => 'required|max:50',
            'unit_price' => 'required|numeric|max:50|min:0.5',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $service = Service::find($id);
        if($service) {
            $is_compulsory_before = $service->is_compulsory;
            if($is_compulsory_before == 0 && $is_compulsory_before!= $request->is_compulsory) {
                $check_use_service = ServiceRegistration::where('service_id', $id)->count();
                if($check_use_service > 0){
                    return response([
                        'message' => 'Cannot update this service to compulsory since it is used',
                        'status' => 403,
                    ]);
                }
            }
            $service->name = $request->name;
            $service->description = $request->description;
            $service->unit = $request->unit;
            $service->unit_price = $request->unit_price;
            $service->is_compulsory = $request->is_compulsory == true ? '1' : '0';
            $service->save();
            return response([
                'message' => 'Successfully update service',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No service found',
                'status' => 404,
            ]);
        }
    }

    public function deleteService($id) {
        $service = Service::find($id);
        if(!$service) {
            return response([
                'message' => 'No service found',
                'status' => 404,
            ]);
        }
        if($service->is_compulsory == 1) {
            return response([
                'message' => 'Cannot delete compulsory service, change to optional service first',
                'status' => 403,
            ]);
        }
        $check_use_service = ServiceRegistration::where('service_id', $id)->count();
        if($check_use_service > 0) {
            return response([
                'message' => 'Cannot delete this service since it is used',
                'status' => 403,
            ]);
        }
        else {
            $service->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete service',
            ]);
        }
    }
}
