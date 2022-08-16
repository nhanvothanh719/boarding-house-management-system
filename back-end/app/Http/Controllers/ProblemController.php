<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use App\Models\User;
use App\Models\RenterProblem;

use App\Mail\ProblemReplyMail;

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
        $validator = Validator::make($request->all(), [
            'reply_text' => 'required',
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
        $problem->replied_by = Auth::user()->id;
        $problem->reply_text = $request->reply_text;
        $problem->status = RenterProblem::STATUS_ONGOING;
        $problem->save();
        $problem_owner_id = $problem->renter_id;
        $owner = User::find($problem_owner_id);
        $responder_name = User::find($problem->replied_by)->name;
        Mail::to($owner->email)->send(new ProblemReplyMail($owner->name, $problem->title, $responder_name, $problem->replied_text)); 
        return response([
            'message' => 'Reply to problem successfully',
            'status' => 200,
        ]);
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
