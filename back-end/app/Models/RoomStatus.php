<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomStatus extends Model
{
    use HasFactory;
    const STATUS_EMPTY = 'Empty';
    const STATUS_OCCUPIED = 'Occupied';
    const STATUS_FULL = 'Full';

    protected $guarded = ['id'];
}
