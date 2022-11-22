<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\Service\ServiceRepositoryInterface;

class ServiceController extends Controller
{
    protected $service;

    public function __construct(ServiceRepositoryInterface $service) {
        $this->service = $service;
    }

    public function index() {
        return response([
            'status' => 200,
            'allServices' => $this->service->all(),
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
        $service = $this->service->store($request->all());
        return response([
            'message' => 'Successfully create new service',
            'status' => 200,
        ]);
    }

    public function getOptionalServices() {
        return response([
            'status' => 200,
            'allOptionalServices' => $this->service->getAllOptionalServices(),
        ]);
    }

    public function getCompulsoryServices() {
        return response([
            'status' => 200,
            'allCompulsoryServices' => $this->service->getAllCompulsoryServices(),
        ]);
    }

    public function editService($id) {
        $service = $this->service->show($id);
        if($service) {
            return response([
                'status' => 200,
                'service' => $service,
            ]);
        }
        return response([
            'status' => 404,
            'message' => 'No service found',
        ]);
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
        $service = $this->service->show($id);
        if(!$service) {
            return response([
                'message' => 'No service found',
                'status' => 404,
            ]);
        }
        $is_updated = $this->service->update($request->all(), $id);
        if(!$is_updated) {
            return response([
                'message' => 'Cannot update this service to compulsory since it is used',
                'status' => 403,
            ]);
        }
        return response([
            'message' => 'Successfully update service',
            'status' => 200,
        ]);
    }

    public function deleteService($id) {
        $service = $this->service->show($id);
        if(!$service) {
            return response([
                'message' => 'No service found',
                'status' => 404,
            ]);
        }  
        if($this->service->checkCompulsory($id)) {
            return response([
                'message' => 'Cannot delete compulsory service',
                'status' => 400,
            ]);
        }
        if($this->service->checkUsed($id)) {
            return response([
                'message' => 'Cannot delete this service since it is used',
                'status' => 400,
            ]);
        }
        $this->service->delete($id);
        return response([
            'status' => 200,
            'message' => 'Successfully delete service',
        ]);
    }

    public function countUsedServices() {
        return response([
            'status' => 200,
            'usedServicesCount' => $this->service->countUsedServices(),
        ]);
    }
}
