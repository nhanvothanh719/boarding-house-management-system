<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    const METHOD_CASH = 'Cash';
    const METHOD_RAZORPAY = 'Rayzorpay';
    const METHOD_PAYPAL = 'Paypal';
    use HasFactory;
    protected $guarded = ['id'];
}
