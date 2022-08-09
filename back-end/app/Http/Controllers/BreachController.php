<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Helpers\CustomHelper;

use App\Models\User;
use App\Models\Breach;
use App\Models\BreachHistory;

use App\Mail\RuleViolateMail;

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
            $is_used = BreachHistory::where('breach_id', $id)->first();
            if($is_used) {
                return response([
                    'message' => 'Cannot delete this breach since it is used',
                    'status' => 404,
                ]);
            }
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
        $breach = Breach::find($request->breach_id);
        $breach_count = BreachHistory::where('breach_id', $request->breach_id)->where('renter_id', $request->renter_id)->count();
        $remain_allowed_number = $breach->allowed_violate_number - $breach_count;
        if($remain_allowed_number <= 0) {
            return response([
                'message' => 'Fail to add since the renter has committed this breach more than allowed times',
                'status' => 404,
            ]);
        }
        $breach_history = BreachHistory::create([
            'breach_id' => $request->breach_id,
            'renter_id' => $request->renter_id,
            'violate_at' => $request->violate_at,
        ]);
        Mail::to($user->email)->send(new RuleViolateMail($user->name, $breach->name, $request->violate_at, $remain_allowed_number));
        return response([
            'status' => 200,
            'message' => 'Successfully add breach history',
        ]);
    }

    public function deleteBreachHistory($id) {
        $breach_history = BreachHistory::find($id);
        if(!$breach_history) {
            return response([
                'message' => 'No record found '.$id,
                'status' => 404,
            ]);
        }
        else {
            $breach_history->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete breach history',
            ]);
        }
    }
}