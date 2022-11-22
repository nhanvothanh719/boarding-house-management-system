<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

use App\Repositories\Motorbike\MotorbikeRepositoryInterface;

class MotorbikeController extends Controller
{
    protected $motorbike;

    public function __construct(MotorbikeRepositoryInterface $motorbike) {
        $this->motorbike = $motorbike;
    }

    public function index() {
        return response([
            'status' => 200,
            'allMotorbikes' => $this->motorbike->all(),
        ]);
    }

    public function deleteMotorbike($id) {
        $motorbike =  $this->motorbike->show($id);
        if($motorbike) {
            File::delete($motorbike->motorbike_image);
            $this->motorbike->delete($id);
            return response([
                'message' => 'Successfully delete motorbike',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No motorbike found',
                'status' => 404,
            ]);
        }
    }

    public function storeMotorbike(Request $request) {
        $validator = Validator::make($request->all(), [
            'renter_id' => 'required|unique:motorbikes|exists:users,id',
            'license_plate' => 'required|min:6|max:10|unique:motorbikes',
            'motorbike_image' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        if($request->hasFile('motorbike_image')) {
            $image = $request->file('motorbike_image');
        } else {
            $image = null;
        }
        $motorbike = $this->motorbike->store($request->all(), $image);
        return response([
            'message' => 'Create new motorbike successfully',
            'status' => 200,
        ]);
    }

    public function editMotorbike($id) {
        $motorbike = $this->motorbike->show($id);
        if($motorbike) {
            return response([
                'status' => 200,
                'motorbike' => $motorbike,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No motorbike found',
            ]);
        }
    }

    public function updateMotorbike(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'renter_id' => ['required', 'exists:users,id', 'unique:motorbikes,renter_id,'.$id],
            'license_plate' => 'required|min:6|max:10|unique:motorbikes,license_plate,'.$id,
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $motorbike = $this->motorbike->show($id);
        if(!$motorbike) {
            return response([
                'message' => 'No motorbike found',
                'status' => 404,
            ]);
        }
        $new_image = null;
        if($request->hasFile('motorbike_image')) {
            $new_image = $request->file('motorbike_image');
        }
        $this->motorbike->update($request->all(), $id, $new_image);
        return response([
            'message' => 'Successfully update motorbike',
            'status' => 200,
        ]);
    }
}
