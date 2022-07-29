<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Service;
use App\Models\User;
use App\Models\ServiceRegistration;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\ExtraFee;
use App\Models\TemporaryInvoice;

class InvoiceController extends Controller
{
    public function storeInvoice(Request $request, $id) {
        $renter = User::find($id);
    }

    public function getRegisteredServices($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'Cannot create temporary invoice due to no user found',
                'status' => 404,
            ]);
        }
        $registered_services = TemporaryInvoice::where('user_id', $id)->get();
        return response([
            'status' => 200,
            'allServices' => $registered_services,
        ]);
    }

    public function createTemporaryInvoice($id) {
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'Cannot create temporary invoice due to no user found',
                'status' => 404,
            ]);
        }
        TemporaryInvoice::where('user_id', $id)->delete();
        $compulsory_services_id = DB::table('services')->where('is_compulsory', Service::COMPULSORY)->pluck('id');
        foreach($compulsory_services_id as $service_id) {
            DB::table('temporary_invoices')->insert([
                'user_id' => $id,
                'service_id' => $service_id,
                'temporary_quantity' => 0,
            ]);
        }
        $optional_services_id = DB::table('service_registrations')->where('user_id', $id)->pluck('service_id');
        foreach($optional_services_id as $service_id) {
            DB::table('temporary_invoices')->insert([
                'user_id' => $id,
                'service_id' => $service_id,
                'temporary_quantity' => 0,
            ]);
        }
        return response([
            'message' => 'Create temporary invoice successful',
            'status' => 200,
        ]);
    }

    public function updateServiceQuantity($service_id, $value)
    {
        if(!is_numeric($value)) 
        {
            return response([
                'message' => 'The value input is not numeric',
                'status' => 404,
            ]);
        }
        $service = TemporaryInvoice::where('id', $service_id)->first();
        $service->temporary_quantity = $value;
        $service->save();
        return response([
            'message' => 'Update value of invoice successfully',
            'status' => 200,
        ]);
    }
    
}
