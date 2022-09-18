<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Mail\InvoiceSendMail;

use App\Repositories\Invoice\InvoiceRepositoryInterface;

class InvoiceController extends Controller
{
    protected $invoice;

    public function __construct(InvoiceRepositoryInterface $invoice) {
        $this->invoice = $invoice;
    }

    public function index() {
        return response([
            'status' => 200,
            'allInvoices' => $this->invoice->all(),
        ]);
    }

    public function storeInvoice(Request $request, $renter_id) {
        $appropriate_date = date('Y-m-d', strtotime(' +0 day'));
        $validator = Validator::make($request->all(), [
            'effective_from' => 'required|date|after_or_equal:'.$appropriate_date,
            'valid_until' => ['required', 'date', 'before_or_equal:'.date("Y-m-d", strtotime($appropriate_date."+15 day")), 'after_or_equal:'.date("Y-m-d", strtotime($appropriate_date."+1 day"))],
            'discount' => 'required|min:0|max:50|integer',
            'month' => 'required|min:1|max:12|integer',
            'extra_fee' => 'numeric|nullable',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($this->invoice->checkCreated($renter_id, $request->month)) {
            return response([
                'message' => 'Renter has already had invoice for the chosen month',
                'status' => 403,
            ]);
        }
        if($request->extra_fee && !$request->extra_fee_description) {
            return response([
                'message' => 'The description field is needed',
                'status' => 403,
            ]);
        }
        $invoice = $this->invoice->store($request->all(), $renter_id);
        return response([
            'message' => "Invoice created successfully",
            'status' => 200,
        ]);
    }

    public function editInvoice($id) {
        $invoice = $this->invoice->show($id);
        if(!$invoice) {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
        return response([
            'invoice' => $invoice,
            'invoiceDetails' => $this->invoice->getInvoiceDetails($id),
            'status' => 200,
        ]);
    }

    public function updateInvoice(Request $request, $id) {
        $appropriate_time = date('Y-m-d', strtotime(' +0 day'));
        $validator = Validator::make($request->all(), [
            'effective_from' => 'required|date|after_or_equal:'.$appropriate_time,
            'valid_until' => ['required', 'date', 'before_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+15 day")), 'after_or_equal:'.date("Y-m-d", strtotime($appropriate_time."+1 day"))],
            'month' => 'required|min:1|max:12|integer',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $invoice = $this->invoice->show($id);
        if(!$invoice) {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
        $is_updated = $this->invoice->update($request->all(), $id);
        if(!$is_updated) {
            return response([
                'message' => 'Cannot paid invoice due to it is overdue',
                'status' => 403,
            ]);
        }
        return response([
            'message' => 'Successfully update invoice',
            'status' => 200,
        ]);
            
    }

    public function deleteInvoice($id) {
        $invoice = $this->invoice->show($id);
        if(!$invoice) {
            return response([
                'message' => 'No invoice found',
                'status' => 404,
            ]);
        }
        if($this->invoice->checkPaid($id)) {
            return response([
                'message' => 'Cannot delete since this invoice is paid',
                'status' => 403,
            ]);
        }
        $this->invoice->delete($id);
        return response([
            'message' => 'Successfully delete invoice',
            'status' => 200,
        ]);
    }

    public function sendInvoice($id) {
        $invoice = $this->invoice->show($id);
        $renter_name = $invoice->renter->name;
        $renter_email = $invoice->renter->email;
        $room = $invoice->renter->room_rent->room;
        if($room == null) {
            return response([
                'message' => 'Renter was not in any room',
                'status' => 403,
            ]);
        }
        $room_number = $room->number;
        $invoice_details = $invoice->services;
        Mail::to($renter_email)->send(new InvoiceSendMail($renter_name, $room_number, $invoice, $invoice_details)); 
        return response([
            'message' => 'Successfully send invoice to the renter',
            'status' => 200,
        ]);
    }
}
