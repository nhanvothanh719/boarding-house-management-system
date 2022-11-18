<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Repositories\PaymentHistory\PaymentHistoryRepositoryInterface;

class PaymentController extends Controller
{
    protected $payment;

    public function __construct(PaymentHistoryRepositoryInterface $payment) {
        $this->payment = $payment;
    }

    public function payInvoice(Request $request, $id) {
        $is_paid = $this->payment->store($request->all(), $id);
        if(!$is_paid) {
            return response([
                'status' => 400,
                'message' => 'Cannot paid invoice due to it is overdue',
            ]);
        }
        return response([
            'status' => 200,
            'message' => 'The invoice is paid successfully'
        ]);
    }

    public function getPaidInvoicesRatio() {
        return response([
            'status' => 200,
            'paidInvoicesRatio' => $this->payment->getPaidInvoicesRatio(),
            'invoicePaidMethodsCount' => $this->payment->countPaidMethods(),
        ]);
    }
}
