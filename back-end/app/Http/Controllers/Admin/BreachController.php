<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\Breach\BreachRepositoryInterface;

class BreachController extends Controller
{
    protected $breach;

    public function __construct(BreachRepositoryInterface $breach) {
        $this->breach = $breach;
    }

    public function index() {
        return response([
            'status' => 200,
            'allBreaches' => $this->breach->all(),
        ]);
    }

    public function storeBreach(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:breaches|regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
            'allowed_violate_number' => 'required|min:1|max:10|integer',
            'severity_level' => 'required|integer',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $breach = $this->breach->store($request->all());
        return response([
            'status' => 200,
            'message' => 'Successfully add breach',
        ]);
    }

    public function editBreach($id) {
        $breach = $this->breach->show($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'breach' => $breach,
        ]);
    }

    public function updateBreach(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => ['required','regex:/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/','unique:breaches,name,'.$id],
            'allowed_violate_number' => 'required|min:1|max:10|integer',
            'severity_level' => 'required|integer',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $breach = $this->breach->show($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        $this->breach->update($request->all(), $id);
        return response([
            'status' => 200,
            'message' => 'Successfully update breach details',
        ]);
    }

    public function deleteBreach($id) {
        $breach = $this->breach->show($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        else {
            if($this->breach->checkUsed($id)) {
                return response([
                    'message' => 'Cannot delete this breach since it is used',
                    'status' => 400,
                ]);
            }
            $this->breach->delete($id);
            return response([
                'status' => 200,
                'message' => 'Successfully delete breach',
            ]);
        }
    }
    
    public function calculateTotalNumberBreachMade() {
        return response([
            'status' => 200,
            'breachTotals' => $this->breach->calculateTotalNumberBreachMade(),
        ]);
    }
}
