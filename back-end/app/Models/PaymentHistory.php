<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    const PAYMENT_METHOD_CASH = 1;
    const PAYMENT_METHOD_RAZORPAY = 2;
    const PAYMENT_METHOD_PAYPAL = 3;

    public function invoice() {
        return $this->belongsTo(Invoice::class,'invoice_id','id');
    }
}
