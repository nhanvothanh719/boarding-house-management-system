<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemporaryInvoice extends Model
{
    use HasFactory;

    protected $with = ['service']; //Used for JS: call over relationship in object query --> item.service.name
    public function service()
     {
         return $this->belongsTo(Service::class,'service_id','id');
     }
}
