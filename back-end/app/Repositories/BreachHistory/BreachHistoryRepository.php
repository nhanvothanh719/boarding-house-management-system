<?php

namespace App\Repositories\BreachHistory;

use App\Models\BreachHistory;

use App\Repositories\User\UserRepositoryInterface;

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
}
