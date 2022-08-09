<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Helpers\CustomHelper;

use App\Models\User;
use App\Models\Breach;
use App\Models\BreachHistory;

class BreachController extends Controller
{
    public function index() {
        $all_breaches = Breach::all();
        return response([
            'status' => 200,
            'allBreaches' => $all_breaches,
        ]);
    }

    public function storeBreach(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:breaches',
            'allowed_violate_number' => 'required|numeric|min:1|max:10|integer',
            'severity_level' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $breach = Breach::create([
            'name' => $request->name,
            'description' => $request->description,
            'severity_level' => $request->severity_level,
            'allowed_violate_number' => $request->allowed_violate_number,
        ]);
        return response([
            'status' => 200,
            'message' => 'Successfully add breach',
        ]);
    }

    public function updateBreach(Request $request, $id) {
        $breach = Breach::find($id);
        if(!$breach) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        $breach->name = $request->name;
        $breach->description = $request->description;
        $breach->severity_level = $request->severity_level;
        $breach->allowed_violate_number = $request->allowed_violate_number;
        $breach->save();
        return response([
            'status' => 200,
            'message' => 'Successfully update breach details',
        ]);
    }

    public function deleteBreach($id) {
        $breach = Breach::find($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        else {
            //Todo: If the breach has renters --> Not allow
            $breach->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete breach',
            ]);
        }
    }

    public function getBreachHistories() {
        $all_breach_histories = BreachHistory::all();
        return response([
            'status' => 200,
            'allBreachHistories' => $all_breach_histories,
        ]);
    }

    public function storeBreachHistory(Request $request) {
        $current_date_time = date('Y-m-d H:i:s');
        $validator = Validator::make($request->all(), [
            'breach_id' => 'required',
            'renter_id' => 'required',
            'violate_at' => 'required|before_or_equal:'.$current_date_time.'|after_or_equal:'.date('Y-m-d H:i:s', strtotime(' -10 day')),
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $user = User::find($request->renter_id);
        if(!$user) {
            return response([
                'errors' => "No user found",
                'status' => 404,
            ]);
        }
        if(CustomHelper::isAdminRole($user)) {
            return response([
                'message' => 'The user with ID is not renter',
                'status' => 404,
            ]);
        }
        $breach_history = BreachHistory::create([
            'breach_id' => $request->breach_id,
            'renter_id' => $request->renter_id,
            'violate_at' => $request->violate_at,
        ]);

        //Todo: Send email

        return response([
            'status' => 200,
            'message' => 'Successfully add breach history',
        ]);
    }

    public function updateBreachHistory(Request $request, $id) {

    }

    public function deleteBreachHistory($id) {

    }
}
