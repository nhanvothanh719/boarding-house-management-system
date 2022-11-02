<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motorbike extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public const MOTORBIKE_IMAGE_PUBLIC_FOLDER = 'uploaded/motorbikes/'; 
    protected $with = ['renter'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }
}
