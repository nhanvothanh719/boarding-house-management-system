<?php

namespace App\Repositories\PaymentHistory;

use \stdClass;

use App\Models\PaymentHistory;

use App\Repositories\Invoice\InvoiceRepositoryInterface;
use App\Repositories\Balance\BalanceRepositoryInterface;

class PaymentHistoryRepository implements PaymentHistoryRepositoryInterface 
{
    private $invoice_repository;
    private $balance_repository;

    public function __construct(InvoiceRepositoryInterface $invoice_repository,
    BalanceRepositoryInterface $balance_repository) 
    {
        $this->invoice_repository = $invoice_repository;
        $this->balance_repository = $balance_repository;
    }

    public function show($id) {
        return PaymentHistory::find($id);
    }

    public function store($data, $invoice_id) {
        $invoice = $this->invoice_repository->show($invoice_id);
        $is_stored = true;
        if(!$this->invoice_repository->checkOverdue($invoice_id)) {
            $is_stored = false;
            return $is_stored;
        }
        $payment = new PaymentHistory;
        $payment->invoice_id = $invoice_id;
        $payment_method = $data['payment_method'];
        switch($payment_method) {
            case 'Razorpay':
                $payment->payment_method = PaymentHistory::PAYMENT_METHOD_RAZORPAY;
                break;
            case 'Paypal':
                $payment->payment_method = PaymentHistory::PAYMENT_METHOD_PAYPAL;
                break;
            default:
                $payment->payment_method = PaymentHistory::PAYMENT_METHOD_CASH;
                break;
        }
        $payment->payment_id = $data['payment_id'];
        $payment->made_by = $invoice->renter_id;
        $payment->made_at = date('Y-m-d H:i:s');
        $payment->save();
        
        $this->balance_repository->handleAfterPayment($invoice, $payment_method);

        return $is_stored;
    }

    public function getPaidInvoicesRatio() {
        $paid_invoices_count = PaymentHistory::count();
        $total_invoices = $this->invoice_repository->countInvoices();
        $paid_invoices_rate = round($paid_invoices_count / $total_invoices * 100);
        return $paid_invoices_rate;
    }

    public function countPaidMethods() {
        $invoice_paid_methods_count = array();
        $paypal_payment = new stdClass();
        $paypal_payment->method_name = "Paypal";
        $paypal_payment->total = PaymentHistory::where('payment_method', PaymentHistory::PAYMENT_METHOD_PAYPAL)->count();
        array_push($invoice_paid_methods_count, $paypal_payment);
        $razorpay_payment = new stdClass();
        $razorpay_payment->method_name = "Razorpay";
        $razorpay_payment->total = PaymentHistory::where('payment_method', PaymentHistory::PAYMENT_METHOD_RAZORPAY)->count();
        array_push($invoice_paid_methods_count, $razorpay_payment);
        $cash_payment = new stdClass();
        $cash_payment->method_name = "Cash";
        $cash_payment->total = PaymentHistory::where('payment_method', PaymentHistory::PAYMENT_METHOD_CASH)->count();
        array_push($invoice_paid_methods_count, $cash_payment);
        return $invoice_paid_methods_count;
    }
}