<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

use App\Mail\ProblemReplyMail;

use App\Repositories\Problem\ProblemRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class ProblemController extends Controller
{
    protected $problem;

    public function __construct(ProblemRepositoryInterface $problem) {
        $this->problem = $problem;
    }

    public function index() {
        return response([
            'status' => 200,
            'allProblems' => $this->problem->all(),
        ]);
    }

    public function getProblemDetails($id) {
        $problem = $this->problem->show($id);
        if($problem) {
            return response([
                'status' => 200,
                'problem' => $problem,
            ]);
        }
        return response([
            'status' => 404,
            'message' => 'No problem found',
        ]);
    }

    public function updateProblemStatus(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'status' => 'required|integer',
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
        $problem = $this->problem->updateStatus($request->all(), $id);
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
        $problem = $this->problem->show($id);
        if(!$problem) {
            return response([
                'message' => 'No problem found',
                'status' => 404,
            ]);
        }
        $responder_id = Auth::user()->id;
        $problem = $this->problem->reply($request->all(), $id, $responder_id);
        $responder_name = Auth::user()->name;
        $owner_name = $problem->renter->name;
        $owner_email = $problem->renter->email;
        Mail::to($owner_email)->send(new ProblemReplyMail($owner_name, $problem->title, $responder_name, $problem->replied_text)); 
        return response([
            'message' => 'Reply to problem successfully',
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
        $this->problem->delete($id);
        return response([
            'status' => 200,
            'message' => 'Successfully delete problem',
        ]);
    }
}
