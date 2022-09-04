<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $with = ['method'];
    public function method()
    {
        return $this->belongsTo(PaymentMethod::class,'payment_method_id','id');
    }
}
