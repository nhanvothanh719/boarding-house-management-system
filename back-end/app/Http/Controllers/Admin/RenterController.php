<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'allRenters' => $this->renter->getAllRenters(),
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

    public function sendAnnouncement(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'content' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $is_sent = $this->renter->sendAnnouncement($request->all());
        if(!$is_sent) {
            return response([
                'message' => "Fail to send announcement due to no renter found",
                'status' => 404,
            ]);
        }
        return response([
            'message' => "Successfully send announcement",
            'status' => 200,
        ]);
    }

    public function countRentersByGender() {
        return response([
            'status' => 200,
            'rentersCount' => $this->renter->countRentersByGender(),
        ]);
    }

    public function getRenterInvoices($id) {
        $renter = $this->renter->show($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'allInvoices' => $this->renter->getRenterInvoices($id),
        ]);
    }

    public function countRenterTotalUsedServicesAmount($id) {
        $renter = $this->renter->show($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'servicesCount' => $this->renter->countRenterTotalUsedServicesAmount($id),
        ]);
    }

    //Renter
    public function countRenterBreaches($id) {
        $renter = $this->renter->show($id);
        if(!$renter) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'breachesTotal' => $this->renter->getRenterBreachHistories($id),
        ]);
    }

    public function countRenters() {
        return response([
            'status' => 200,
            'total' => $this->renter->countRenters(),
        ]);
    }
}
