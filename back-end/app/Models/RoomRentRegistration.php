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
}
