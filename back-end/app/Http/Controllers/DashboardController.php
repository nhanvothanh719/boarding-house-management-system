<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function countUsedServices($id) {
        $services_count = array();
        $services_id = Service::pluck('id')->toArray();
        foreach($services_id as $service_id) {
            $item =new stdClass(); //stdClass is a generic 'empty' class used when casting other types to objects
            $item->service_name = Service::where('id', $service_id)->value('name');
            $item->total = InvoiceDetail::where('service_id', $service_id )->count();
            array_push($services_count, $item);
        }
        //$services_id = DB::table('services')->lists('id');
        return $services_count;
    }
}
