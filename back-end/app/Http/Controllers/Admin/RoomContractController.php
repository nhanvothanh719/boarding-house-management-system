<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Helpers\CustomHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

use App\Models\User;
use App\Models\RoomContract;

class RoomContractController extends Controller
{
    public const room_contract_public_folder = 'uploaded/room_contract';

    public function index() {
        $all_room_contracts = RoomContract::all();
        return response([
            'status' => 200,
            'allRoomContracts' => $all_room_contracts,
        ]);
    }

    public function storeRoomContract(Request $request) {
        $min_effective_from = date('Y-m-d', strtotime(' -7 day'));
        $max_effective_from = date('Y-m-d', strtotime(' +0 day'));
        $min_effective_until = date('Y-m-d', strtotime(' +1 month'));
        $max_effective_until = date('Y-m-d', strtotime(' +3 year'));
        $validator = Validator::make($request->all(), [
            'renter_id' => 'required|unique:room_contracts',
            'deposit_amount' => 'required|numeric|min:50|max:200',
            'effective_from' => ['required','date', 'before_or_equal:'.$max_effective_from, 'after_or_equal:'.$min_effective_from],
            'effective_until' => ['required','date', 'before_or_equal:'.$max_effective_until, 'after_or_equal:'.$min_effective_until],
            'owner_signature' => 'required|image',
            'renter_signature' => 'required|image',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $user = User::find($request->renter_id);
        if(!$user) 
        {
            return response([
                'message' => 'No user found',
                'status' => 404,
            ]);
        }
        if(CustomHelper::isAdminRole($user))
        {
            return response([
                'message' => 'The user with ID is not renter',
                'status' => 404,
            ]);
        }
        $room_contract = new RoomContract;
        $room_contract->renter_id = $request->renter_id;
        $room_contract->deposit_amount = $request->deposit_amount;
        $room_contract->effective_from = $request->effective_from;
        $room_contract->effective_until = $request->effective_until;
        $upload_folder = RoomContractController::room_contract_public_folder.'/'.$request->renter_id.'/';
        $owner_signature = $request->file('owner_signature');
        $room_contract->owner_signature = CustomHelper::addImage($owner_signature, $upload_folder);
        $renter_signature = $request->file('renter_signature');
        $room_contract->renter_signature = CustomHelper::addImage($renter_signature, $upload_folder);
        $room_contract->save();
        return response([
            'message' => 'Create new room contract successfully',
            'status' => 200,
        ]);
    }

    public function updateRoomContract(Request $request, $id) {
        $room_contract = RoomContract::find($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        $room_contract->effective_until = $request->effective_until;
        $room_contract->deposit_amount = $request->deposit_amount;
        $room_contract->save();
        return response([
            'message' => 'Update room contract successfully',
            'status' => 200,
        ]);
    }

    public function getRoomContractDetails($id) {
        $room_contract = RoomContract::find($id);
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
        $validator = Validator::make($request->all(), [
            'owner_signature' => 'image',
            'renter_signature' => 'image',
        ]);
        if($validator->fails()) 
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $room_contract = RoomContract::find($id);
        if(!$room_contract) {
            return response([
                'message' => 'No room contract found',
                'status' => 404,
            ]);
        }
        $old_owner_signature = $room_contract->owner_signature;
        $old_renter_signature = $room_contract->renter_signature;
        $upload_folder = RoomContractController::room_contract_public_folder.'/'.$room_contract->renter_id.'/';
        $room_contract->owner_signature = CustomHelper::updateImage($old_owner_signature, $request->file('owner_signature'), $upload_folder);
        $room_contract->renter_signature = CustomHelper::updateImage($old_renter_signature, $request->file('renter_signature'), $upload_folder);
        $room_contract->save();
        return response([
            'message' => 'Update signatures in room contract successfully',
            'status' => 200,
        ]);
    }

    public function deleteRoomContract($id) {
        $room_contract = RoomContract::find($id);
        if(!$room_contract) {
            return response([
                'message' => 'No renter found',
                'status' => 404,
            ]);
        }
        //Delete existed images:
        $upload_folder = RoomContractController::room_contract_public_folder.'/'.$room_contract->renter_id.'/';
        //In folder
        File::deleteDirectory(public_path($upload_folder));
        $room_contract->delete();
        return response([
            'message' => 'Successfully delete room contract',
            'status' => 200,
        ]);
    }
}
