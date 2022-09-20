<?php

namespace App\Repositories\Breach;

use App\Models\Breach;

class BreachRepository implements BreachRepositoryInterface 
{
    public function all() {
        return Breach::all();
    }

    public function show($id) {
        return Breach::find($id);
    }

    public function store(array $data) {
        $breach = Breach::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'severity_level' => $data['severity_level'],
            'allowed_violate_number' => $data['allowed_violate_number'],
        ]);
        return $breach;
    }

    public function update(array $data, $id) {
        $breach = $this::show($id);
        $breach->name = $data['name'];
        $breach->description = $data['description'];
        $breach->severity_level = $data['severity_level'];
        $breach->allowed_violate_number = $data['allowed_violate_number'];
        $breach->save();
    }

    public function delete($id) {
        $breach = $this::show($id);
        $breach->delete();
    }

    public function checkUsed($id) {
        $is_used = false;
        if(Breach::where('id', $id)->withCount('renter_breaches')->get()[0]->renter_breaches_count > 0){
            $is_used = true;
        }
        return $is_used;
    }

    public function calculateTotalNumberBreachMade() {
        return Breach::withCount('breach_histories')->get(); 
    }

    public function getAllowedViolationNumberOfBreach($id) {
        return $this::show($id)->allowed_violate_number;
    }

    public function getRenterBreachDetails($renter_id) {
        return Breach::withCount('breach_histories', );

        
        // $breaches_id = Breach::pluck('id')->toArray();
        // $renter_breach_details = array();
        // foreach($breaches_id as $breach_id) {
        //     $item = new stdClass();
        //     $breach = Breach::find($breach_id);
        //     $item->id = $breach->id;
        //     $item->name = $breach->name;
        //     $item->description = $breach->description;
        //     $item->allowed_violate_number = $breach->allowed_violate_number;
        //     $item->severity_level = $breach->severity_level;
        //     $item->total = BreachHistory::where('renter_id', $renter_id)->where('breach_id', $breach_id)->count();
        //     array_push($renter_breach_details, $item);
        // }
    }
}