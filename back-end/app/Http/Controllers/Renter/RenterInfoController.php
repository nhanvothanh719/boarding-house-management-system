<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use App\Repositories\User\UserRepositoryInterface;

use Illuminate\Support\Facades\Auth;

class RenterInfoController extends Controller
{
    protected $renter;

    public function __construct(UserRepositoryInterface $renter) {
        $this->renter = $renter;
    }

    public function getRenterBreaches() {
        $current_renter_id = Auth::user()->id;
        return response([
            'status' => 200,
            'renterBreachDetails' => $this->renter->getRenterBreachHistories($current_renter_id),
        ]);
    }
}
