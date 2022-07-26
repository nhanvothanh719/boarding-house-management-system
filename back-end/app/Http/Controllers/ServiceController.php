<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Service;

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
            'name' => 'required|unique:services|max:100|string',
            'unit' => 'required|max:50',
            'unit_price' => 'required|numeric',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 404,
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
                'status' => 404,
            ], 404);
        }
    }

    public function editService() {

    }

    public function updateService() {

    }

    public function deleteService() {

    }
}
