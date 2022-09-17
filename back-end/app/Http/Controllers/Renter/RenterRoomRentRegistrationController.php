<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Repositories\RoomRentRegistration\RoomRentRegistrationRepositoryInterface;

class RenterRoomRentRegistrationController extends Controller
{
    protected $request;

    public function __construct(RoomRentRegistrationRepositoryInterface $request) {
        $this->request = $request;
    }
}
