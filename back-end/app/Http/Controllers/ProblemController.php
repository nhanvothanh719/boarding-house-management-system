<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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

    public function updateProblemStatus(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'status' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $problem = RenterProblem::find($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        $problem->status = $request->status;
        $problem->save();
        return response([
            'message' => 'Update problem successfully',
            'status' => 200,
        ]);
    }

    public function replyProblem(Request $request, $id) {

    }

    public function deleteProblem($id) {
        $problem = RenterProblem::find($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        $problem->delete();
        return response([
            'status' => 200,
            'message' => 'Successfully delete problem',
        ]);
    }
}
