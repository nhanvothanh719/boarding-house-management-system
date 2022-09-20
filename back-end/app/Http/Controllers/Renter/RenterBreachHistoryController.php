<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

use App\Repositories\BreachHistory\BreachHistoryRepositoryInterface;

class RenterBreachHistoryController extends Controller
{
    protected $breach_history;

    public function __construct(BreachHistoryRepositoryInterface $breach_history) {
        $this->breach_history = $breach_history;
    }

    public function getRenterBreachHistories($id) {
        $current_renter_id = Auth::user()->id;
        return response([
            'status' => 200,
            'breachHistories' => $this->breach_history->getHistoriesOfBreach($current_renter_id, $id),
        ]);
    }
}
