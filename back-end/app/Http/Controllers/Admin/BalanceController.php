<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\Balance\BalanceRepositoryInterface;

class BalanceController extends Controller
{
    protected $balance;

    public function __construct(BalanceRepositoryInterface $balance) {
        $this->balance = $balance;
    }

    public function index() {
        return response([
            'status' => 200,
            'allDetails' => $this->balance->all(),
        ]);
    }

    public function updateBalance(Request $request) {
        $before_appropriate_time = date('Y-m-d H:i:s', strtotime(' -1 hours'));
        $after_appropriate_time = date('Y-m-d H:i:s', strtotime(' -3 months'));
        $validator = Validator::make($request->all(), [
            'description' => 'required',
            'is_income' => 'required',
            'amount' => 'required|numeric|gt:0', //gt: greater than
            'occurred_on' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $balance = $this->balance->store($request->all());
        return response([
            'status' => 200,
            'message' => 'Successfully add balance change',
        ]);
    }

    public function calculateBalance() {
        $recent_balance_changes = $this->balance->getRecentBalanceChanges();
        return response([
            'status' => 200,
            'recentBalanceChanges' => $recent_balance_changes, 
            'currentBalance' => round(last($recent_balance_changes)->amount, 2),
        ]);
    }

    public function getExpenseRatio() {
        return response([
            'status' => 200,
            'pieData' => $this->balance->calculateExpenseRatio(), 
        ]);
    }

    public function editBalanceChange($id) {
        $balance_change = $this->balance->show($id);
        if(!$balance_change) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'balanceChange' => $balance_change,
        ]);
    }

    public function updateBalanceChange(Request $request, $id) {
        $before_appropriate_time = date('Y-m-d H:i:s', strtotime(' -1 hours'));
        $after_appropriate_time = date('Y-m-d H:i:s', strtotime(' -3 months'));
        $validator = Validator::make($request->all(), [
            'description' => 'required',
            'amount' => 'required|numeric|gt:0', //gt: greater than
            'occurred_on' => ['required','date', 'before_or_equal:'.$before_appropriate_time, 'after_or_equal:'.$after_appropriate_time],
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $balance_change = $this->balance->show($id);
        if(!$balance_change) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        $this->balance->update($request->all(), $id);
        return response([
            'status' => 200,
            'message' => 'Successfully update balance change',
        ]);
    }

    public function deleteBalanceChange($id) {
        $balance_change = $this->balance->show($id);
        if(!$balance_change) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        else {
            $this->balance->delete($id);
            return response([
                'status' => 200,
                'message' => 'Successfully delete balance change',
            ]);
        }
    }

    public function getEarnedAmount() {
        return response([
            'status' => 200,
            'amount' => $this->balance->getEarnedAmount(),
        ]);
    }
}
