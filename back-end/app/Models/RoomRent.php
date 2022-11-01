<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomRent extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $with = ['renter'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }

    public function room() {
        return $this->belongsTo(Room::class,'room_id','id');
    }
}
