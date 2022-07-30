<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    const COMPULSORY = 1;
    const OPTIONAL = 0;
    protected $guarded = ['id'];

    
}
