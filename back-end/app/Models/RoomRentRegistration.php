<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomRentRegistration extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['room'];

    const STATUS_ACCEPTED = 1;
    const STATUS_NOT_ACCEPTED = 0;

    public function room() {
        return $this->belongsTo(Room::class,'registered_room_id','id');
    }
}
