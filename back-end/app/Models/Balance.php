<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balance extends Model
{
    use HasFactory;

    const CATEGORY_EARNED = 1;
    const CATEGORY_EXPENSE = 0;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'balance';
    protected $guarded = ['id'];
}
