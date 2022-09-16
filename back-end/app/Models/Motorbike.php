<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Motorbike extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['renter'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }

    public const motorbike_image_public_folder = 'uploaded/motorbikes/';
}
