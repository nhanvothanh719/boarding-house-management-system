<?php

namespace App\Repositories\Room;

use App\Models\Room;

use Illuminate\Support\Facades\File;

use App\Repositories\RoomImage\RoomImageRepositoryInterface;

use stdClass;

class RoomRepository implements RoomRepositoryInterface
{
    private $image_repository;

    public function __construct(RoomImageRepositoryInterface $image_repository) 
    {
        $this->image_repository = $image_repository;
    }

    public function all() {
        return Room::with('category')->get();
    }

    public function show($id) {
        return Room::with('rents', 'category')->find($id);
    }

    public function getAvailableRooms() {
        return Room::where('status', '!=', Room::STATUS_FULL)->get();
    }

    public function store($data) {
        $room = new Room;
        $room->number = $data['number'];
        $room->status = Room::STATUS_EMPTY;
        $room->category_id = $data['category_id'];
        $room->description = $data['description'];
        $room->area = $data['area'];
        $room->has_conditioner = $data['has_conditioner'] == true ? '1' : '0';
        $room->has_fridge = $data['has_fridge'] == true ? '1' : '0';
        $room->has_wardrobe = $data['has_wardrobe'] == true ? '1' : '0';
        $room->save();
        if($data['image'] !== null) {
            $files = $data['image'];
            $this->image_repository->store($files, $room->id);
        }
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

    public function updateImages($files, $id) {
        return $this->image_repository->update($files, $id);
    }

    public function delete($id) {
        $room = $this::show($id);
        $room->rents()->delete();
        $room->rent_requests()->delete();
        $this->image_repository->delete($id);
        return $room->delete();
    }

    public function checkUsed($id) {
        $is_used = true;
        $room_status = Room::where('id', $id)->value('status');
        if($room_status == Room::STATUS_EMPTY) {
            $is_used = false;
        }
        return $is_used;
    }

    public function updateIncreaseRoomStatus($id) {
        $is_updated = true;
        $room = Room::find($id);
        $room_status = $room->status;
        switch($room_status) {
            case(Room::STATUS_FULL):
                $is_updated = false;
                break;
            case(Room::STATUS_OCCUPIED):
                $room->status = Room::STATUS_FULL;
                break;
            case(Room::STATUS_EMPTY):
                $room->status = Room::STATUS_OCCUPIED;
                break;
        }
        $room->save();
        return $is_updated;
    }

    public function updateDecreaseRoomStatus($id) {
        $is_updated = true;
        $room = Room::find($id);
        $room_status = $room->status;
        switch($room_status) {
            case(Room::STATUS_FULL):
                $room->status = Room::STATUS_OCCUPIED;
                break;
            case(Room::STATUS_OCCUPIED):
                $room->status = Room::STATUS_EMPTY;
                break;
            case(Room::STATUS_EMPTY):
                $is_updated = false;
                break;
        }
        $room->save();
        return $is_updated;
    }

    public function countRoomsByStatus() {
        $rooms_count = array();
        $empty_rooms = new stdClass;
        $empty_rooms->status = "Empty";
        $empty_rooms->total = Room::where('status', ROOM::STATUS_EMPTY)->count();
        array_push($rooms_count, $empty_rooms);
        $occupied_rooms = new stdClass;
        $occupied_rooms->status = "Occupied";
        $occupied_rooms->total = Room::where('status', ROOM::STATUS_OCCUPIED)->count();
        array_push($rooms_count, $occupied_rooms);
        $full_rooms = new stdClass;
        $full_rooms->status = "Full";
        $full_rooms->total = Room::where('status', ROOM::STATUS_FULL)->count();
        array_push($rooms_count, $full_rooms);
        return $rooms_count;
    }

    public function countRooms() {
        return Room::count();
    }
}