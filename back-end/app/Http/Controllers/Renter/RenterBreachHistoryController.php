<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use \stdClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Breach;
use App\Models\BreachHistory;

class RenterBreachHistoryController extends Controller
{
    public function getRenterBreachHistories($id) {
        $current_renter_id = Auth::user()->id;
        $breach_histories = BreachHistory::where('renter_id', $current_renter_id)->where('breach_id', $id)->get();
        return response([
            'status' => 200,
            'breachHistories' => $breach_histories,
        ]);
    }

    public function getBreachDetails($id) {
        $breach = Breach::find($id);
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

    public function getRenterBreaches() {
        $user = Auth::user();
        $breaches_id = Breach::pluck('id')->toArray();
        $renter_breach_details = array();
        foreach($breaches_id as $breach_id) {
            $item = new stdClass();
            $breach = Breach::find($breach_id);
            $item->id = $breach->id;
            $item->name = $breach->name;
            $item->description = $breach->description;
            $item->allowed_violate_number = $breach->allowed_violate_number;
            $item->severity_level = $breach->severity_level;
            $item->total = BreachHistory::where('renter_id', $user->id)->where('breach_id', $breach_id)->count();
            array_push($renter_breach_details, $item);
        }
        return response([
            'status' => 200,
            'renterBreachDetails' => $renter_breach_details,
        ]);
    }
}
