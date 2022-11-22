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

    const ROLE_ADMIN = 0;
    const ROLE_RENTER = 1;

    public const AVATAR_PUBLIC_FOLDER = 'uploaded/avatars'; 

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

    public function motorbike() {
        return $this->hasOne(Motorbike::class, 'renter_id', 'id');
    }

    public function breach_histories() {
        return $this->hasMany(BreachHistory::class, 'renter_id');
    }

    public function invoices() {
        return $this->hasMany(Invoice::class, 'renter_id');
    }

    public function payment_histories() {
        return $this->hasMany(PaymentHistory::class, 'made_by');
    }

    public function room_contract() {
        return $this->hasOne(RoomContract::class, 'renter_id', 'id');
    }

    public function room_rent() {
        return $this->hasOne(RoomRent::class, 'renter_id', 'id');
    }

    public function problems() {
        return $this->hasMany(Problem::class, 'renter_id');
    }

    public function service_registrations() {
        return $this->hasMany(ServiceRegistration::class, 'user_id');
    }

    public function password_reset_histories() {
        return $this->hasMany(PasswordReset::class, 'email', 'id');
    }
}
