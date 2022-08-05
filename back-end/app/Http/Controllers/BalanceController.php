<?php

namespace App\Http\Controllers;

use \stdClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Balance;

class BalanceController extends Controller
{
    //Chi tra ve 30 gia tri gan nhat
    public function index() {
        $all_details = Balance::all();
        return response([
            'status' => 200,
            'allDetails' => $all_details,
        ]);
    }

    public function updateBalance(Request $request) {
        $validator = Validator::make($request->all(), [
            'description' => 'required',
            'is_income' => 'required',
            'amount' => 'required|numeric',
            'occurred_on' => 'required|date',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 404,
            ]);
        }
        $balance = Balance::create([
            'description' => $request->description,
            'is_income' => $request->is_income,
            'amount' => $request->amount,
            'occurred_on' => $request->occurred_on,
        ]);
        BalanceController::updateBalanceAmount();
        return response([
            'status' => 200,
            'message' => 'Successfully add change',
        ]);
    }

    public function updateBalanceAmount() {

    }

    public function calculateBalance() {
        //Get recent changes
        $recent_changes = Balance::orderBy('occurred_on', 'DESC')->get();
        //Group all the same date
        $recent_changes = $recent_changes->groupBy('occurred_on');
        //
        $recent_changes_array = array();
        foreach ($recent_changes as $change) {
            array_push($recent_changes_array, $change);
        }
        //Get maximum 15 recent values
        $changes_number = count($recent_changes_array);
        if($changes_number > 15) {
            $recent_changes_array = array_splice($recent_changes_array, 0, 14);
        }
        //Reverse the collection --> (values() for resetting the keys)
        $recent_changes_array = array_reverse($recent_changes_array);
        //$recent_changes = $recent_changes;
        $grouped_recent_changes = array();
        foreach($recent_changes_array as $recent_changes_item) {
            $amount = 0;
            $item = new stdClass();
            $item->occurred_on = $recent_changes_item[0]['occurred_on'];
            foreach($recent_changes_item as $change) {
                if($change->is_income == 0) {
                    $change->amount = -1 * $change->amount;
                }
                $amount = $amount + $change->amount;
            }
            if($amount > 0) {
                $item->is_income = 1;
            }
            else {
                $item->is_income = 0;
            }
            $item->amount = $amount;
            array_push($grouped_recent_changes, $item);
        }
        $recent_balance_changes = array();
        foreach($grouped_recent_changes as $key => $change) {
            $item = new stdClass();
            $item->occurred_on = $change->occurred_on;
            if($key == 0) {
                $item->amount = $grouped_recent_changes[0]->amount;
            } else if($key == 1) {
                $item->amount = $grouped_recent_changes[$key - 1]->amount + $change->amount;
            } else {
                $item->amount = $recent_balance_changes[$key - 2]->amount + $grouped_recent_changes[$key - 1]->amount + $change->amount;
            }
            array_push($recent_balance_changes, $item);
        }
        return response([
            'status' => 200,
            'recentBalanceChanges' => $recent_balance_changes, 
        ]);
    }

    public function getDataForPieChart() {
        $pie_data = array();
        $expenses = new stdClass();
        $expenses->description = "Expenses";
        $expenses->total = Balance::where('is_income', 0)->sum('amount');
        array_push($pie_data, $expenses);
        $earned = new stdClass();
        $earned->description = "Earned";
        $earned->total = Balance::where('is_income', 1)->sum('amount');
        array_push($pie_data, $earned);
        return response([
            'status' => 200,
            'pieData' => $pie_data, 
        ]);
    }

    public function updateBalanceChange(Request $request, $id) {
        $balance_change = Balance::find($id);
        if(!$balance_change) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        $balance_change->amount = $request->amount;
        $balance_change->occurred_on = $request->occurred_on;
        $balance_change->description = $request->description;
        $balance_change->save();
        return response([
            'status' => 200,
            'message' => 'Successfully update balance change',
        ]);
    }

    public function deleteBalanceChange($id) {
        $balance_change = Balance::find($id);
        if(!$balance_change) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        else {
            $balance_change->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete balance change',
            ]);
        }
    }
}
