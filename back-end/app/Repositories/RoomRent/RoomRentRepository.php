<?php

namespace App\Repositories\RoomRent;

use App\Helpers\CustomHelper;

use App\Models\RoomRent;

class RoomRentRepository implements RoomRentRepositoryInterface
{
    public function all() {
        return RoomRent::all();
    }

    public function show($id) {
        return RoomRent::find($id);
    }

    public function store($data) {
        $rent = new RoomRent;
        $rent->room_id = $data['room_id'];
        $rent->renter_id = $data['renter_id'];
        $rent->save();
        return $rent;
    }

    public function update($data, $id) {

    }

    public function delete($id) {
        $this::show($id)->delete();
    }
}