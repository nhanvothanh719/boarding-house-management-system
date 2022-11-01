<?php

namespace App\Repositories\Balance;

use \stdClass;

use App\Models\Balance;

use App\Mail\InvoicePaidMail;

use Illuminate\Support\Facades\Mail;

class BalanceRepository implements BalanceRepositoryInterface 
{
    public function all() {
        return Balance::all();
    }

    public function show($id) {
        return Balance::find($id);
    }

    public function store($data) {
        $balance = Balance::create([
            'description' => $data['description'],
            'is_income' => $data['is_income'],
            'amount' => $data['amount'],
            'occurred_on' => $data['occurred_on'],
        ]);
        return $balance;
    }

    public function update($data, $id) {
        $balance_change = $this::show($id);
        $balance_change->amount = $data['amount'];
        $balance_change->occurred_on = $data['occurred_on'];
        $balance_change->description = $data['description'];
        $balance_change->save();
        return $balance_change;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function groupRecentBalanceChangesByDate() {
        //Get recent changes
        $recent_changes = Balance::orderBy('occurred_on', 'DESC')->get();
        //Group things happened on same date
        $recent_changes = $recent_changes->groupBy('occurred_on');
        
        $recent_changes_array = array();
        foreach ($recent_changes as $change) {
            array_push($recent_changes_array, $change);
        }
        //Get maximum 15 recent values
        if(count($recent_changes_array) > 15) {
            $recent_changes_array = array_splice($recent_changes_array, 0, 14);
        }
        //Reverse the array for displaying on chart
        $recent_changes_array = array_reverse($recent_changes_array);
        return $recent_changes_array;
    }

    public function calculateRecentChanges() {
        $recent_changes_array = $this::groupRecentBalanceChangesByDate();
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
                $item->is_income = Balance::CATEGORY_EARNED; 
            }
            else {
                $item->is_income = Balance::CATEGORY_EXPENSE;
            }
            $item->amount = $amount;
            array_push($grouped_recent_changes, $item);
        }
        return $grouped_recent_changes;
    }

    public function getRecentBalanceChanges() {
        $grouped_recent_changes = $this::calculateRecentChanges();
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
        return $recent_balance_changes;
    }

    public function calculateExpenseRate() {
        $money_type = array();
        $expenses = new stdClass();
        $expenses->description = "Expenses";
        $expenses->total = Balance::where('is_income', Balance::CATEGORY_EXPENSE)->sum('amount');
        array_push($money_type, $expenses);
        $earned = new stdClass();
        $earned->description = "Earned";
        $earned->total = Balance::where('is_income', Balance::CATEGORY_EARNED)->sum('amount');
        array_push($money_type, $earned);
        return $money_type;
    }

    public function handleAfterPayment($invoice, $payment_method) {
        //Automatically add income
        $balance = Balance::create([
            'description' => 'Income from invoice with ID: '.$invoice->id,
            'is_income' => Balance::CATEGORY_EARNED,
            'amount' => $invoice->total,
            'occurred_on' => date('Y-m-d', strtotime(' +0 day')),
        ]);
        //Send email confirmation
        $renter_email = $invoice->renter->email;
        Mail::to($renter_email)->send(new InvoicePaidMail(
            $invoice->month,
            $invoice->year,
            $invoice->total,
            $payment_method
        ));
        return $balance;
    }

    public function getEarnedAmount() {
        return round(Balance::where('is_income', Balance::CATEGORY_EARNED)->sum('amount'), 2);
    }
}