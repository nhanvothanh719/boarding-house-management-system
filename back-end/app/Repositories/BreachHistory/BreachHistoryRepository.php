<?php

namespace App\Repositories\BreachHistory;

use App\Models\BreachHistory;

use App\Repositories\User\UserRepositoryInterface;
use stdClass;

class BreachHistoryRepository implements BreachHistoryRepositoryInterface 
{
    private $user_repository;

    public function __construct(UserRepositoryInterface $user_repository) 
    {
        $this->user_repository = $user_repository;
    }

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
        $id = BreachHistory::where('breach_id', $breach_id)->first()->id;
        $allowed_violate_number = $this::show($id)->breach->allowed_violate_number;
        $breach_count = BreachHistory::where('breach_id', $breach_id)->where('renter_id', $renter_id)->count();
        $remain_allowed_number = $allowed_violate_number - $breach_count;
        return $remain_allowed_number;
    }

    public function checkAdminRole($id) {
        return $this->user_repository->checkAdminRole($id);
    }

    public function lockUserAccount($id) {
        return $this->user_repository->lockUserAccount($id);
    }

    public function getTotalBreachesByMonth() {
        $current_month = 11;
        $months_in_year = 12;
        $breaches_in_month_count = array();
        for($month = 1; $month <= $months_in_year; $month++) {
            $total_breaches_in_month = BreachHistory::whereYear('violated_at', date('Y'))
            ->whereMonth('violated_at', $month)->count();
            $item = new stdClass();
            $item->month = $month;
            if($month <= $current_month) {
                $item->total_breaches_in_month = $total_breaches_in_month;
            }
            array_push($breaches_in_month_count, $item);
        }
        return $breaches_in_month_count;
    }

    public function getHistoriesOfBreach($renter_id, $breach_id) {
        return BreachHistory::where('renter_id', $renter_id)->where('breach_id', $breach_id)->get();
    }
}
