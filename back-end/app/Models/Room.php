<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $with = ['category', 'status'];

    public function category() {
        return $this->belongsTo(Category::class,'category_id','id');
    }

    public function status() {
        return $this->belongsTo(RoomStatus::class,'status','id');
    }
}
