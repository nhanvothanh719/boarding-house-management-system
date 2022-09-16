<?php

namespace App\Repositories\BreachHistory;

use App\Helpers\CustomHelper;
use App\Models\BreachHistory;

class BreachHistoryRepository implements BreachHistoryRepositoryInterface 
{
    public function all() {
        return BreachHistory::all();
    }

    public function show($id) {
        return BreachHistory::find($id);
    }

    public function store($data) {
        $breach_history = BreachHistory::create([
            'breach_id' => $data['breach_id'],
            'renter_id' => $data['renter_id'],
            'violated_at' => $data['violated_at'],
        ]);
        return $breach_history;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function calculateBreachRemainAllowedNumber($renter_id, $breach_id) {
        $allowed_violate_number = CustomHelper::getBreachAllowedNumber($breach_id);
        $breach_count = BreachHistory::where('breach_id', $breach_id)->where('renter_id', $renter_id)->count();
        $remain_allowed_number = $allowed_violate_number - $breach_count;
        return $remain_allowed_number;
    }
}
