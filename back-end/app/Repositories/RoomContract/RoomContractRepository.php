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
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$room_contract->renter_id.'/';
        File::deleteDirectory(public_path($upload_folder));
        return $room_contract->delete();
    }

    public function updateSignatures($id, $owner_signature, $renter_signature) {
        $renter_id = $this::show($id)->renter_id;
        if($owner_signature != null) {
            $old_owner_signature = $room_contract->owner_signature;
            $room_contract->owner_signature = $this->updateSignature($renter_id, $old_owner_signature, $owner_signature);
        }
        if($renter_signature != null) {
            $old_renter_signature = $room_contract->renter_signature;
            $room_contract->renter_signature = $this->updateSignature($renter_id, $old_renter_signature, $renter_signature);
        }
        $room_contract->save();
        return $room_contract;
    }

    public function storeSignature($renter_id, $signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$renter_id.'/';
        $generated_name = hexdec(uniqid());
        $extension = $signature->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        if(!file_exists($upload_folder)) {
            //mkdir($upload_folder);
            mkdir($upload_folder, 0777, true);
        }
        $signature->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }

    public function updateSignature($renter_id, $old_signature, $new_signature) {
        $upload_folder = RoomContract::ROOM_CONTRACT_PUBLIC_FOLDER.'/'.$renter_id.'/';
        if(!file_exists($upload_folder)) {
            //mkdir($upload_folder);
            mkdir($upload_folder, 0777, true);
        }
        //Delete existed image
        File::delete($old_signature);
        //Add new image
        $generated_name = hexdec(uniqid());
        $extension = $new_signature->getClientOriginalExtension();
        $image_name = $generated_name.'.'.$extension;
        $new_signature->move($upload_folder, $image_name);
        return $upload_folder.$image_name;
    }

    public function findRoomContractByRenterId($id) {
        return RoomContract::where('renter_id', $id)->first();
    }
}