<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    const COMPULSORY = 1;
    const OPTIONAL = 0;

    public function users() {
        return $this->hasMany(ServiceRegistration::class, 'service_id', 'id');
    }
}
