<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Mail\RuleViolateMail;

use App\Repositories\BreachHistory\BreachHistoryRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class BreachHistoryController extends Controller
{
    protected $breach_history;

    public function __construct(BreachHistoryRepositoryInterface $breach_history) {
        $this->breach_history = $breach_history;
    }

    public function getBreachHistories() {
        return response([
            'status' => 200,
            'allBreachHistories' => $this->breach_history->all(),
        ]);
    }

    public function storeBreachHistory(Request $request) {
        $current_date_time = date('Y-m-d H:i:s');
        $validator = Validator::make($request->all(), [
            'breach_id' => 'required|exists:breaches,id',
            'renter_id' => 'required|exists:users,id',
            'violated_at' => 'required|before_or_equal:'.$current_date_time.'|after_or_equal:'.date('Y-m-d H:i:s', strtotime(' -10 day')),
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($this->breach_history->checkAdminRole($request->renter_id)) {
            return response([
                'message' => 'The user is not renter',
                'status' => 400,
            ]);
        }
        if(!$this->breach_history->checkIfRenterHasSameBreachHistory($request->renter_id, $request->breach_id)) {
            //Store breach history first
            $breach_history = $this->breach_history->store($request->all());
            $remain_allowed_number = $this->breach_history->calculateBreachRemainAllowedNumber($request->renter_id, $request->breach_id);
        } else {
            //Calculate remain allowed number first
            $remain_allowed_number = $this->breach_history->calculateBreachRemainAllowedNumber($request->renter_id, $request->breach_id);
            //Lock user's account
            if($remain_allowed_number == 1) {
                $is_locked_successfully = $this->breach_history->lockUserAccount($request->renter_id);
            }
            if($remain_allowed_number <= 0) {
                return response([
                    'message' => 'Fail to add since the renter has committed this breach more than allowed times',
                    'status' => 400,
                ]);
            }
            $breach_history = $this->breach_history->store($request->all());
        }
        Mail::to($breach_history->renter->email)->send(new RuleViolateMail($breach_history->renter->name, $breach_history->breach->name, $request->violated_at, $remain_allowed_number));
        return response([
            'status' => 200,
            'message' => 'Successfully add breach history',
        ]);
    }

    public function deleteBreachHistory($id) {
        $breach_history = $this->breach_history->show($id);
        if(!$breach_history) {
            return response([
                'message' => 'No record found',
                'status' => 404,
            ]);
        }
        $this->breach_history->delete($id);
        return response([
            'status' => 200,
            'message' => 'Successfully delete breach history',
        ]);
    }

    public function reportBreaches() {
        return response([
            'status' => 200,
            'breachesInMonthCount' => $this->breach_history->getTotalBreachesByMonth(),
        ]);
    }
}
