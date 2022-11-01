<?php

namespace App\Repositories\RoomRent;

use App\Models\RoomRent;

use App\Repositories\Room\RoomRepositoryInterface;
use App\Repositories\User\UserRepositoryInterface;

class RoomRentRepository implements RoomRentRepositoryInterface
{
    private $room_repository;
    private $user_repository;

    public function __construct(RoomRepositoryInterface $room_repository, UserRepositoryInterface $user_repository) 
    {
        $this->room_repository = $room_repository;
        $this->user_repository = $user_repository;
    }

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

    public function accept($data) {
        $is_updated = false;
        if($this->user_repository->checkAdminRole($data['renter_id'])) {
            return $is_updated;
        }
        $renter_gender = $this->user_repository->show($data['renter_id'])->gender;
        $is_accepted_by_room_status = $this->room_repository->updateIncreaseRoomStatus($data['room_id']);
        if(!$is_accepted_by_room_status) {
            return $is_updated;
        } 
        //Check same gender
        $is_accepted_by_gender = $this::checkGender($data['room_id'], $renter_gender);
        if(!$is_accepted_by_gender) {
            return $is_updated;
        } 
        $is_updated = true; 
        return $is_updated;
    }

    public function cancel($id) {
        $room_rent = $this::show($id);
        $is_updated = $this->room_repository->updateDecreaseRoomStatus($room_rent->room_id);
        $room_rent->delete();
        return $is_updated;
    }

    public function checkGender($room_id, $renter_gender) {
        $is_same_gender = false;
        $room = $this->room_repository->show($room_id);
        $room_rent = $room->rents->first();
        //Check renter in room
        if($room_rent == null) {
            //Check registered user
            $partner = $room->rent_requests->first();
            if($partner == null) {
                $is_same_gender = true;
            } else {
                $is_same_gender = $partner->sender_gender == $renter_gender ? true : false;
            }
        } else {
            $renter_in_room = $room_rent->renter;
            $partner_gender = $renter_in_room->gender;
            $is_same_gender = $partner_gender == $renter_gender ? true : false;
        }
        return $is_same_gender;
    }

    public function checkRentRoom($renter_id) {
        return RoomRent::where('renter_id', $renter_id)->first() ? true : false;
    }

    public function getRenterRoom($renter_id) {
        $renter_room_id = RoomRent::where('renter_id', $renter_id)->value('room_id');
        return $this->room_repository->show($renter_room_id);
    }

    public function getRenterCurrentRoomPartners($renter_id) {
        $rented_room_id = RoomRent::where('renter_id', $renter_id)->value('room_id');
        $roommates_id = RoomRent::where('room_id', $rented_room_id)->where('renter_id', '!=', $renter_id)->pluck('renter_id');
        $roommates = array();
        foreach($roommates_id as $roommate_id) {
            $roommate = $this->user_repository->show($roommate_id);
            array_push($roommates, $roommate);
        }
        return $roommates;
    }
}