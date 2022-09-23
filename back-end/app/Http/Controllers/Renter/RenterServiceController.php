<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

use App\Repositories\Service\ServiceRepositoryInterface;

class RenterServiceController extends Controller
{
    protected $service;

    public function __construct(ServiceRepositoryInterface $service) {
        $this->service = $service;
    }

    public function getRegisteredServices() {
        $current_renter_id = Auth::user()->id;
        return response([
            'status' => 200,
            'allServices' => $this->service->getRegisteredServices($current_renter_id)->merge($this->service->getAllCompulsoryServices()),
        ]);
    }
}
