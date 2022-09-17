<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Helpers\CustomHelper;

use Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail; 
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Role;
use App\Models\Motorbike;



class RenterController extends Controller
{
    protected $balance;

    public function __construct(BalanceRepositoryInterface $balance) {
        $this->balance = $balance;
    }

    public function index() {
        $all_renters = User::where('role_id', CustomHelper::getRenterRoleId())->get();
        return response([
            'status' => 200,
            'allRenters' => $all_renters,
        ]);
    }

    //<!-- Change controller

    public function getRenterBreaches($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        $renter_breaches = BreachHistory::where('renter_id', $id)->get();
        return response([
            'status' => 200,
            'renterBreaches' => $renter_breaches,
        ]);
    }

    public function getRenterTotalNumberBreachMade() {
        $all_renters = User::where('role_id', Role::where('name', Role::ROLE_RENTER)->value('id'))->get();
        $renter_total = array();
        foreach($all_renters as $renter) {
            $item = new stdClass();
            $item->renter_id = $renter->id;
            $item->renter_name = $renter->name;
            $item->total = BreachHistory::where('renter_id', $renter->id)->count();
            array_push($renter_total, $item);
        }
        return response([
            'status' => 200,
            'renterTotal' => $renter_total,
        ]);
    }

    public function countRenterBreaches($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        $breaches_id = Breach::pluck('id')->toArray();
        $breaches_total = array();
        foreach($breaches_id as $breach_id) {
            $item = new stdClass();
            $item->breach_name = Breach::find($breach_id)->name;
            $item->total = BreachHistory::where('renter_id', $id)->where('breach_id', $breach_id)->count();;
            array_push($breaches_total, $item);
        }
        return response([
            'status' => 200,
            'breachesTotal' => $breaches_total,
        ]);
    }

    //-->

    //<!--

    public function getRegisteredServices($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        $all_services = array();
        $registered_services_id = ServiceRegistration::where('user_id', $id)->pluck('service_id');
        foreach($registered_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->id = $service_id;
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            $item->quantity = 0;
            array_push($all_services, $item);
        }
        $compulsory_services_id = Service::where('is_compulsory', Service::COMPULSORY)->pluck('id');
        foreach($compulsory_services_id as $service_id) {
            $service = Service::find($service_id);
            $item = new stdClass();
            $item->id = $service_id;
            $item->name = $service->name;
            $item->is_compulsory = $service->is_compulsory;
            $item->unit = $service->unit;
            $item->unit_price = $service->unit_price;
            $item->quantity = 0;
            array_push($all_services, $item);
        }
        return response([
            'status' => 200,
            'allServices' => $all_services,
        ]);
    }
    
    //-->
}
