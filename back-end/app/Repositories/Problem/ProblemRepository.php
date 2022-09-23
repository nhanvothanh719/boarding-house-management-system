<?php

namespace App\Repositories\Problem;

use App\Models\Problem;
use Illuminate\Support\Facades\Auth;

class ProblemRepository implements ProblemRepositoryInterface {
    public function all() {
        return Problem::all();
    }

    public function show($id) {
        return Problem::find($id);
    }

    public function store($data) {
        $problem = Problem::create([
            'renter_id' => Auth::user()->id,
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

    public function reply($data, $id)
    {
        $problem = $this::show($id);
        $problem->replied_by = Auth::user()->id;
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