<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\Problem;

class RenterProblemController extends Controller
{
    public function getRenterProblems() {
        $current_renter_id = Auth::user()->id;
        $all_problems = Problem::where('renter_id', $current_renter_id)->get();
        return response([
            "status" => 200,
            "allProblems" => $all_problems, 
        ]);
    }

    public function storeProblem(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'description' => 'required',
            'severity_level' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
            $problem = Problem::create([
                'renter_id' => Auth::user()->id,
                'title' => $request->title,
                'description' => $request->description,
                'severity_level' => $request->severity_level,
                'status' => Problem::STATUS_PENDING,
            ]); 
            return response([
                'status' => 200,
                'message' => 'Successfully send created problem to admin',
            ]);
    }

    public function getProblemDetails($id) {
        $problem = Problem::find($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        return response([
            'problem' => $problem,
            'status' => 200,
        ]);
    }

    public function updateProblem(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'description' => 'required',
            'severity_level' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $problem = Problem::find($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        $problem->title = $request->title;
        $problem->description = $request->description;
        $problem->severity_level = $request->severity_level;
        $problem->save();
        return response([
            'message' => 'Update problem successfully',
            'status' => 200,
        ]);
    }

    public function deleteProblem($id) {
        $problem = Problem::find($id);
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
