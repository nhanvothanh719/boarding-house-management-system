<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRegistration extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['user', 'service'];

    public function user() {
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function service() {
        return $this->belongsTo(Service::class,'service_id','id');
    }
}
