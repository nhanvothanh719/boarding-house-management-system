<?php

namespace App\Repositories\Problem;

use App\Models\Problem;

class ProblemRepository implements ProblemRepositoryInterface {
    public function all() {
        return Problem::all();
    }

    public function show($id) {
        return Problem::find($id);
    }

    public function store($data, $renter_id) {
        $problem = Problem::create([
            'renter_id' => $renter_id,
            'title' => $data['title'],
            'description' => $data['description'],
            'severity_level' => $data['severity_level'],
            'status' => Problem::STATUS_PENDING,
        ]); 
        return $problem;
    }

    public function update($data, $id) {
        $problem = $this::show($id);
        $problem->title = $data['title'];
        $problem->description = $data['description'];
        $problem->severity_level = $data['severity_level'];
        $problem->save();
        return $problem;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function updateStatus($data, $id) {
        $problem = $this::show($id);
        $problem->status = $data['status'];
        $problem->save();
        return $problem;
    }

    public function reply($data, $id, $responder_id)
    {
        $problem = $this::show($id);
        $problem->replied_by = $responder_id;
        $problem->reply_text = $data['reply_text'];
        $problem->status = Problem::STATUS_ONGOING;
        $problem->save();
        return $problem;
    }

    public function findByRenterId($id)
    {
        return Problem::where('renter_id', $id)->get();
    }
}