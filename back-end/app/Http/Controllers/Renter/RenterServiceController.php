<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use \stdClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Service;
use App\Models\ServiceRegistration;

class RenterServiceController extends Controller
{
    public function getRegisteredServices() {
        $current_renter_id = Auth::user()->id;
        $all_services = array();
        $registered_services_id = ServiceRegistration::where('user_id', $current_renter_id)->pluck('service_id');
        foreach($registered_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            array_push($all_services, $item);
        }
        $compulsory_services_id = Service::where('is_compulsory', Service::COMPULSORY)->pluck('id');
        foreach($compulsory_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            array_push($all_services, $item);
        }
        return response([
            'status' => 200,
            'allServices' => $all_services,
        ]);
    }
}
