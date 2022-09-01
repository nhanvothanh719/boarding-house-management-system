<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    const GENDER_MALE_ID = 1;
    const GENDER_FEMALE_ID = 0;

    const LOCKED_ACCOUNT = 1;
    const AVAILABLE_ACCOUNT = 0;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'date_of_birth',
        'id_card_number',
        'phone_number',
        'occupation',
        'permanent_address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $with = ['role', 'room'];
    public function role()
    {
        return $this->belongsTo(Role::class,'role_id','id');
    }

    public function room()
    {
        return $this->hasOneThrough(Room::class, RoomRent::class, 'renter_id', 'id', 'id', 'id');
    }
}
