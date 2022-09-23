<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BreachHistory extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $with = ['renter', 'breach'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }

    public function breach() {
        return $this->belongsTo(Breach::class,'breach_id','id');
    }
}
