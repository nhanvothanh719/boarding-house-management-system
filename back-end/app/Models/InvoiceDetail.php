<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $with = ['service'];

    public function service()
    {
        return $this->belongsTo(Service::class,'service_id','id');
    }
}
