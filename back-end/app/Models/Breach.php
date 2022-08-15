<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Breach extends Model
{
    use HasFactory;

    // 1: serious, 2: significant, 3: normal, 4: negligible

    const SEVERITY_SERIOUS = 1;
    const SEVERITY_SIGNIFICANT = 2;
    const SEVERITY_NORMAL = 3;
    const SEVERITY_NEGLIGIBLE = 4;

    protected $guarded = ['id'];
}
