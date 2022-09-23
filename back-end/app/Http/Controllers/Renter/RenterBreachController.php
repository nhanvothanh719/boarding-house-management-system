<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use App\Repositories\Breach\BreachRepositoryInterface;

class RenterBreachController extends Controller
{
    protected $breach;

    public function __construct(BreachRepositoryInterface $breach) {
        $this->breach = $breach;
    }

    public function getBreachDetails($id) {
        $breach = $this->breach->show($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'breach' => $breach,
        ]);
    }
}
