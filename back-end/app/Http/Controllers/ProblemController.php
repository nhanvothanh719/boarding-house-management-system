<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\RenterProblem;

class ProblemController extends Controller
{
    public function index() {
        $all_problems = RenterProblem::all();
        return response([
            'status' => 200,
            'allProblems' => $all_problems,
        ]);
    }

    public function getProblemDetails($id) {

    }

    public function updateProblem(Request $request, $id) {

    }

    public function deleteProblem($id) {

    }
}
