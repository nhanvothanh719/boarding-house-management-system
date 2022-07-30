<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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

    public function storeInvoice(Request $request, $id) {
        $current_year = date('Y');
        $appropriate_time = date('Y-m-d', strtotime(' +0 day'));
        $validator = Validator::make($request->all(), [
            'effective_from' => 'required|date|after_or_equal:'.$appropriate_time,
            'valid_until' => ['required', 'date', 'before_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+15 day")), 'after_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+1 day"))],
            'discount' => 'required|min:0|max:100',
            'month' => 'required|min:1|max:12',
            'extra_fee' => 'numeric|nullable',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($request->extra_fee) {
            if(!$request->description) {
                return response([
                    'message' => 'The description field is needed',
                    'status' => 404,
                ]);
            }
        }
        $user = User::find($id);
        if(!$user) {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        //Create invoice without calculating total
        $invoice = Invoice::create([
            'renter_id' => $id,
            'discount' => $request->discount,
            'month' => $request->month,
            'year' => $current_year,
            'effective_from' => $request->effective_from,
            'valid_until' => $request->valid_until,
        ]);
        //Create invoice details
        InvoiceController::storeInvoiceDetails($id, $invoice->id);
        //Insert extra fee (if any)
        if($request->extra_fee) {
            ExtraFee::create([
                'invoice_id' => $invoice->id,
                'subtotal' => $request->extra_fee,
                'description' => $request->description,
            ]);
        }
        //Update total value
        $total = InvoiceController::updateTotal($invoice->id, $request->discount);
        $current_invoice = Invoice::find($invoice->id);
        $current_invoice->total = round($total, 2);
        $current_invoice->save();
        InvoiceController::deleteTemporaryInvoice($id);
        return response([
            'message' => "Invoice created successfully",
            'status' => 200,
        ]);
    }

    public function storeInvoiceDetails($id, $invoice_id) {
        $used_services = TemporaryInvoice::where('user_id', $id)->get();
        foreach($used_services as $service) {
            $invoice_detail = new InvoiceDetail;
            $invoice_detail->invoice_id = $invoice_id;
            $invoice_detail->service_id = $service->service_id;
            $service_quantity = $service->temporary_quantity;
            $invoice_detail->quantity = $service->temporary_quantity;
            $service_unit_price = Service::where('id', $service->service_id)->value('unit_price');
            $invoice_detail->subtotal = round($service->temporary_quantity * $service_unit_price, 2);
            $invoice_detail->save();
        }
    }

    public function updateTotal($invoice_id, $discount) {
        $total = 0;
        $services_subtotal = InvoiceDetail::where('invoice_id', $invoice_id)->pluck('subtotal');
        foreach($services_subtotal as $subtotal) {
            $total = $total + $subtotal;
        }
        if($discount !== 0) {
            $total = $total * (100 - $discount) / 100;
        }
        $extra_fee = ExtraFee::find($invoice_id);
        if($extra_fee) {
            $extra_fee_value = ExtraFee::where('invoice_id', $invoice_id)->pluck('subtotal');
            $total = $total + $extra_fee_value;
        }
        return $total;
    }
    
    public function deleteTemporaryInvoice($user_id) {
        TemporaryInvoice::where('user_id', $user_id)->delete();
    }
}
