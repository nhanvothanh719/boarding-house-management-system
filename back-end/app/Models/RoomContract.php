<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomContract extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['renter'];

    public const ROOM_CONTRACT_PUBLIC_FOLDER = 'uploaded/room_contract'; 

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }
}
