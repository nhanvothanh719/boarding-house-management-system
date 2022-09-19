<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomRentRegistration extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    const STATUS_ACCEPTED = 1;
    const STATUS_NOT_ACCEPTED = 0;

    protected $with = ['room'];

    public function room() {
        return $this->belongsTo(Room::class,'registered_room_id','id');
    }
}
