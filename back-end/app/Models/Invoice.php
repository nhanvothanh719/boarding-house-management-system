<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    const STATUS_PAID = 1;
    const STATUS_NOT_PAID = 0;
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['renter', 'services', 'payment'];
    public function renter()
    {
        return $this->belongsTo(User::class,'renter_id','id');
    }

    public function services()
    {
        //return $this->belongsToMany(Invoice::class, 'invoice_details', 'service_id', 'invoice_id');
        return $this->hasMany(InvoiceDetail::class, 'invoice_id', 'id');
    }

    public function payment()
    {
        return $this->hasOne(PaymentHistory::class, 'invoice_id', 'id');
    }

}
