<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Repositories\User\UserRepositoryInterface;

class RenterController extends Controller
{
    protected $renter;

    public function __construct(UserRepositoryInterface $renter) {
        $this->renter = $renter;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRenters' => $this->renter->allRenters(),
        ]);
    }

    public function getRenterBreachHistories($id) {
        $user = $this->renter->show($id);
        if(!$user) {
            return response([
                'status' => 404,
                'message' => 'No renter found',
            ]);
        }
        return response([
            'status' => 200,
            'renterBreachHistories' => $this->renter->getBreachHistories($id),
        ]);
    }

    public function getRegisteredServices($id) {
        $renter = $this->renter->show($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'allServices' => $this->renter->getRegisteredServices($id),
        ]);
    }
}
