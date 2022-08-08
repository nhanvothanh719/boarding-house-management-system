<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Breach;

class BreachController extends Controller
{
    public function index() {
        $all_breaches = Breach::all();
        return response([
            'status' => 200,
            'allBreaches' => $all_breaches,
        ]);
    }

    public function storeBreach(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:breaches',
            'allowed_violate_number' => 'required|numeric|min:1|max:10|integer',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $breach = Breach::create([
            'name' => $request->name,
            'description' => $request->description,
            'allowed_violate_number' => $request->allowed_violate_number,
        ]);
        return response([
            'status' => 200,
            'message' => 'Successfully add breach',
        ]);
    }

    public function updateBreach(Request $request, $id) {
        $breach = Breach::find($id);
        if(!$breach) {
            return response([
                'message' => 'No balance change found',
                'status' => 404,
            ]);
        }
        $breach->name = $request->name;
        $breach->description = $request->description;
        $breach->allowed_violate_number = $request->allowed_violate_number;
        $breach->save();
        return response([
            'status' => 200,
            'message' => 'Successfully update breach details',
        ]);
    }

    public function deleteBreach($id) {
        $breach = Breach::find($id);
        if(!$breach) {
            return response([
                'message' => 'No breach found',
                'status' => 404,
            ]);
        }
        else {
            //Todo: If the breach has renters --> Not allow
            $breach->delete();
            return response([
                'status' => 200,
                'message' => 'Successfully delete breach',
            ]);
        }
    }

}
