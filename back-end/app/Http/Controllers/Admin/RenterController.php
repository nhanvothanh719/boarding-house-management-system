<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Repositories\User\UserRepositoryInterface;

class RenterController extends Controller
{
    protected $renter;

    public function __construct(UserRepositoryInterface $renter) {
        $this->renter = $renter;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRenters' => $this->renter->allRenters(),
        ]);
    }

    public function getRenterBreachHistories($id) {
        $user = $this->renter->show($id);
        if(!$user) {
            return response([
                'status' => 404,
                'message' => 'No renter found',
            ]);
        }
        return response([
            'status' => 200,
            'renterBreachHistories' => $this->renter->getBreachHistories($id),
        ]);
    }

    public function getRegisteredServices($id) {
        $renter = $this->renter->show($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'allServices' => $this->renter->getRegisteredServices($id),
        ]);
    }

    // public function getRenterInvoices($id) {
    //     $renter = User::find($id);
    //     if(!$renter) {
    //         return response([
    //             'message' => 'No renter found',
    //             'status' => 404,
    //         ]);
    //     }
    //     $all_invoices = Invoice::where('renter_id', $id)->orderBy('month', 'asc')->get();
    //     return response([
    //         'status' => 200,
    //         'allInvoices' => $all_invoices,
    //         'servicesCount' => InvoiceController::countUsedServices($id),
    //     ]);
    // }

    // public function countUsedServices($id) {
    //     $services_count = array();
    //     $services_id = Service::pluck('id')->toArray();
    //     $renter_invoices_id = Invoice::where('renter_id', $id)->pluck('id');
    //     //Get all invoices belonging to renter
    //     foreach($services_id as $service_id) {
    //         $count = 0;
    //         foreach($renter_invoices_id as $invoice_id) {
    //             $services_id_in_invoice_details = InvoiceDetail::where('invoice_id', $invoice_id)->pluck('service_id');
    //             foreach($services_id_in_invoice_details as $detail_service_id) {
    //                 if($detail_service_id == $service_id) {
    //                     $count++;
    //                 }
    //             }
    //         }
    //         $item = new stdClass(); //stdClass is a generic 'empty' class used when casting other types to objects
    //         $item->service_name = Service::where('id', $service_id)->value('name');
    //         $item->total = $count;
    //         array_push($services_count, $item);
    //     }
    //     return $services_count;  
    // }
}
