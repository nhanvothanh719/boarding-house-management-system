<?php

namespace App\Http\Controllers\Renter;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Repositories\Problem\ProblemRepositoryInterface;

class RenterProblemController extends Controller
{
    protected $problem;

    public function __construct(ProblemRepositoryInterface $problem) {
        $this->problem = $problem;
    }

    public function getRenterProblems() {
        $current_renter_id = Auth::user()->id;
        return response([
            "status" => 200,
            "allProblems" => $this->problem->findByRenterId($current_renter_id), 
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
            $problem = $this->problem->store($request->all());
            return response([
                'status' => 200,
                'message' => 'Successfully send created problem to admin',
            ]);
    }

    public function getProblemDetails($id) {
        $problem = $this->problem->show($id);
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
        $problem = $this->problem->show($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        $this->problem->update($request->all(), $id);
        return response([
            'message' => 'Update problem successfully',
            'status' => 200,
        ]);
    }

    public function deleteProblem($id) {
        $problem = $this->problem->show($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        if($problem->renter->id != Auth::user()->id) {
            return response([
                'message' => 'Cannot delete problem belonging to others',
                'status' => 400,
            ]);
        }
        $this->problem->delete($id);
        return response([
            'status' => 200,
            'message' => 'Successfully delete problem',
        ]);
    }
}
