<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    const SEVERITY_HIGH = 1;
    const SEVERITY_NORMAL = 2;
    const SEVERITY_LOW = 3;

    const STATUS_PENDING = 1;
    const STATUS_ONGOING = 2;
    const STATUS_SOLVED = 3;

    protected $with = ['renter', 'responder'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }

    public function responder() {
        return $this->belongsTo(User::class,'replied_by','id');
    }
}
