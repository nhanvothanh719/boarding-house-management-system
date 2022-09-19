<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomContract extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    
    public const ROOM_CONTRACT_PUBLIC_FOLDER = 'uploaded/room_contract'; 

   protected $with = ['renter'];

    public function renter() {
        return $this->belongsTo(User::class,'renter_id','id');
    }
}
