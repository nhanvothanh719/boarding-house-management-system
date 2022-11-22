<?php

namespace App\Repositories\RoomContract;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

use App\Helpers\CustomHelper;

use App\Models\RoomContract;

class RoomContractRepository implements RoomContractRepositoryInterface
{
    public function all() {
        return RoomContract::all();
    }

    public function show($id) {
        return RoomContract::find($id);
    }

    public function store($data, $owner_signature, $renter_signature) {
        $room_contract = new RoomContract;
        $room_contract->renter_id = $data['renter_id'];
        $room_contract->deposit_amount = $data['deposit_amount'];
        $room_contract->effective_from = $data['effective_from'];
        $room_contract->effective_until = $data['effective_until'];
        $room_contract->owner_signature = $this->storeSignature($data['renter_id'], $owner_signature);
        $room_contract->renter_signature = $this->storeSignature($data['renter_id'], $renter_signature);
        $room_contract->save();
        return $room_contract;
    }

    public function update($data, $id) {
        $room_contract = $this::show($id);
        $room_contract->effective_until = $data['effective_until'];
        $room_contract->deposit_amount = $data['deposit_amount'];
        $room_contract->save();
        return $room_contract;
    }

    public function delete($id) {
        $room_contract = $this::show($id);
        //Delete images:
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$room_contract->renter_id;
        if($room_contract->owner_signature != null || $room_contract->renter_signature != null) {
            Storage::disk('s3')->deleteDirectory($upload_folder);
        }
        return $room_contract->delete();
    }

    public function updateSignatures($id, $owner_signature, $renter_signature) {
        $room_contract = $this::show($id);
        $renter_id = $this::show($id)->renter_id;
        if($owner_signature != null) {
            $room_contract->owner_signature = $this->updateOwnerSignature($renter_id, $owner_signature);
        }
        if($renter_signature != null) {
            $room_contract->renter_signature = $this->updateRenterSignature($renter_id, $renter_signature);
        }
        $room_contract->save();
        return $room_contract;
    }

    public function storeSignature($renter_id, $signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$renter_id;
        $path = $signature->store($upload_folder, 's3');
        return $path;
    }

    public function updateOwnerSignature($renter_id, $new_signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$renter_id;
        $old_owner_signature = RoomContract::where('renter_id', $renter_id)->first()->owner_signature;
        if($old_owner_signature != null) {
            if(Storage::disk('s3')->exists($old_owner_signature)) {
                Storage::disk('s3')->delete($old_owner_signature);
            }
        }
        $path = $new_signature->store($upload_folder, 's3');
        return $path;
    }

    public function updateRenterSignature($renter_id, $new_signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$renter_id;
        $old_renter_signature = RoomContract::where('renter_id', $renter_id)->first()->renter_signature;
        if($old_renter_signature != null) {
            if(Storage::disk('s3')->exists($old_renter_signature)) {
                Storage::disk('s3')->delete($old_renter_signature);
            }
        }
        $path = $new_signature->store($upload_folder, 's3');
        return $path;
    }

    public function findRoomContractByRenterId($id) {
        return RoomContract::where('renter_id', $id)->first();
    }
}