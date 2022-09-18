<?php

namespace App\Repositories\PaymentHistory;

use App\Models\PaymentHistory;

use App\Repositories\Invoice\InvoiceRepositoryInterface;

class PaymentHistoryRepository implements PaymentHistoryRepositoryInterface 
{
    private $invoice_repository;

    public function __construct(InvoiceRepositoryInterface $invoice_detail_repository) 
    {
        $this->invoice_detail_repository = $invoice_detail_repository;
    }

    public function show($id) {
        return PaymentHistory::find($id);
    }

    public function store($data, $invoice_id, $renter_id) {
        $is_stored = true;
        if($this->invoice_repository->checkOverdue($invoice_id)) {
            $is_stored = false;
            return $is_stored;
        }
        $payment = new PaymentHistory;
        $payment->invoice_id = $invoice_id;
        $payment_method = $data['payment_method'];
        switch($payment_method) {
            case 'Razorpay':
                $payment->payment_method_id = PaymentHistory::PAYMENT_METHOD_RAZORPAY;
                break;
            case 'Paypal':
                $payment->payment_method_id = PaymentHistory::PAYMENT_METHOD_PAYPAL;
                break;
            default:
                $payment->payment_method_id = PaymentHistory::PAYMENT_METHOD_CASH;
                break;
        }
        $payment->payment_id = $data['payment_id'];
        $payment->made_by = $renter_id;
        $payment->made_at = date('Y-m-d H:i:s');
        $payment->save();
        //Mark the invoice as is paid
        $this->invoice_repository->markAsPaid($invoice_id);
        
        //CustomHelper::handleAfterPayment($request, $user_id ,$id);

        return $is_stored;
    }
}