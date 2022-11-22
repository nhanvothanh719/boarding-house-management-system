<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\RoomContract\RoomContractRepositoryInterface;

class RoomContractController extends Controller
{
    protected $contract;

    public function __construct(RoomContractRepositoryInterface $contract) {
        $this->contract = $contract;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRoomContracts' => $this->contract->all(),
        ]);
    }

    public function storeRoomContract(Request $request) {
        $min_effective_from = date('Y-m-d', strtotime(' -7 day'));
        $max_effective_from = date('Y-m-d', strtotime(' +0 day'));
        $min_effective_until = date('Y-m-d', strtotime(' +1 month'));
        $max_effective_until = date('Y-m-d', strtotime(' +3 year'));
        $validator = Validator::make($request->all(), [
            'renter_id' => 'required|unique:room_contracts|exists:users,id',
            'deposit_amount' => 'required|numeric|min:50|max:200',
            'effective_from' => ['required','date', 'before_or_equal:'.$max_effective_from, 'after_or_equal:'.$min_effective_from],
            'effective_until' => ['required','date', 'before_or_equal:'.$max_effective_until, 'after_or_equal:'.$min_effective_until],
            'owner_signature' => 'required',
            'renter_signature' => 'required',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $owner_signature = $request->file('owner_signature');
        $renter_signature = $request->file('renter_signature');
        $room_contract = $this->contract->store($request->all(), $owner_signature, $renter_signature);
        return response([
            'message' => 'Create new room contract successfully',
            'status' => 200,
        ]);
    }

    public function updateRoomContract(Request $request, $id) {
        $min_effective_until = date('Y-m-d', strtotime(' +1 month'));
        $max_effective_until = date('Y-m-d', strtotime(' +3 year'));
        $validator = Validator::make($request->all(), [
            'deposit_amount' => 'required|numeric|min:50|max:200',
            'effective_until' => ['required','date', 'before_or_equal:'.$max_effective_until, 'after_or_equal:'.$min_effective_until],
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $room_contract = $this->contract->show($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        $this->contract->update($request->all(), $id);
        return response([
            'message' => 'Update room contract successfully',
            'status' => 200,
        ]);
    }

    public function getRoomContractDetails($id) {
        $room_contract = $this->contract->show($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        return response([
            'status' => 200,
            'roomContractDetails' => $room_contract,
        ]);
    }

    public function updateSignatures(Request $request, $id) {
        $room_contract = $this->contract->show($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        $owner_signature = $request->file('owner_signature');
        $renter_signature = $request->file('renter_signature');
        $this->contract->updateSignatures($id, $owner_signature, $renter_signature);
        $room_contract->save();
        return response([
            'message' => 'Update signatures in room contract successfully',
            'status' => 200,
        ]);
    }

    public function deleteRoomContract($id) {
        $room_contract = $this->contract->show($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        $this->contract->delete($id);
        return response([
            'message' => 'Successfully delete room contract',
            'status' => 200,
        ]);
    }
}
