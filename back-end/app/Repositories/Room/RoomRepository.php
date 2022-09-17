<?php

namespace App\Repositories\Room;

use App\Models\Room;

class RoomRepository implements RoomRepositoryInterface
{

    public function all() {
        return Room::all();
    }

    public function show($id) {
        return Room::with('renters')->find($id);
    }

    public function getAvailableRooms() {
        return Room::where('status_id', '!=', Room::STATUS_EMPTY)->get();
    }

    public function store($data) {
        $room = new Room;
        $room->number = $data['number'];
        $room->status_id = Room::STATUS_EMPTY;
        $room->category_id = $data['category_id'];
        $room->description = $data['description'];
        $room->area = $data['area'];
        $room->has_conditioner = $data['has_conditioner'] == true ? '1' : '0';
        $room->has_fridge = $data['has_fridge'] == true ? '1' : '0';
        $room->has_wardrobe = $data['has_wardrobe'] == true ? '1' : '0';
        $room->save();
        return $room;
    }

    public function update($data, $id) {
        $room = $this::show($id);
        $room->number = $data['number'];
        $room->category_id = $data['category_id'];
        $room->description = $data['description'];
        $room->area = $data['area'];
        $room->has_conditioner = $data['has_conditioner'];
        $room->has_fridge = $data['has_fridge'];
        $room->has_wardrobe = $data['has_wardrobe'];
        $room->save();
        return $room;
    }

    public function delete($id) {
        $room = $this::show($id);
        $room->images()->delete();
        $room->rents()->delete();
        $room->rent_requests()->delete();
        return $room->delete();
    }

    public function checkUsed($id) {
        $is_used = true;
        $room_status_id = Room::where('id', $id)->value('status_id');
        if($room_status_id == Room::STATUS_EMPTY) {
            $is_used = false;
        }
        return $is_used;
    }
}