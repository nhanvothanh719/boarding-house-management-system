<?php

namespace App\Repositories\RoomContract;

use Illuminate\Support\Facades\File;

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
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$data['renter_id'].'/';
        $room_contract->owner_signature = CustomHelper::addImage($owner_signature, $upload_folder);
        $room_contract->renter_signature = CustomHelper::addImage($renter_signature, $upload_folder);
        $room_contract->save();
    }

    public function update($data, $id) {
        $room_contract = $this::show($id);
        $room_contract->effective_until = $data['effective_until'];
        $room_contract->deposit_amount = $data['deposit_amount'];
        $room_contract->save();
    }

    public function delete($id) {
        $room_contract = $this::show($id);
        //Delete images:
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$room_contract->renter_id.'/';
        File::deleteDirectory(public_path($upload_folder));
        $room_contract->delete();
    }

    public function updateSignatures($id, $owner_signature, $renter_signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$id.'/';
        $room_contract = $this::show($id);
        if($owner_signature != null) {
            $old_owner_signature = $room_contract->owner_signature;
            $room_contract->owner_signature = CustomHelper::updateImage($old_owner_signature, $owner_signature, $upload_folder);
        }
        if($renter_signature != null) {
            $old_renter_signature = $room_contract->renter_signature;
            $room_contract->renter_signature = CustomHelper::updateImage($old_renter_signature, $renter_signature, $upload_folder);
        }
        $room_contract->save();
    }

    public function findRoomContractByRenterId($id) {
        return RoomContract::where('renter_id', $id)->first();
    }
}