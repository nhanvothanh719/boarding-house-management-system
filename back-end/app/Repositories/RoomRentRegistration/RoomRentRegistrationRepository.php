<?php

namespace App\Repositories\RoomRentRegistration;

use App\Models\RoomRentRegistration;

use App\Repositories\Room\RoomRepositoryInterface;

class RoomRentRegistrationRepository implements RoomRentRegistrationRepositoryInterface
{
    private $room_repository;

    public function __construct(RoomRepositoryInterface $room_repository) 
    {
        $this->room_repository = $room_repository;
    }

    public function all() {
        return RoomRentRegistration::all();
    }

    public function show($id) {
        return RoomRentRegistration::find($id);
    }

    public function store(array $data) {
        $room_rent_registration = new RoomRentRegistration;
        $room_rent_registration->sender_name = $data['sender_name'];
        $room_rent_registration->sender_gender = $data['sender_gender'];
        $room_rent_registration->sender_email = $data['sender_email'];
        $room_rent_registration->sender_phone_number = $data['sender_phone_number'];
        $room_rent_registration->registered_room_id = $data['registered_room_id'];
        $room_rent_registration->save();
        return $room_rent_registration;
    }

    public function accept($id) {
        $is_updated = true;
        $room_rent_registration = $this::show($id);
        $registered_room = $this->room_repository->show($room_rent_registration->registered_room_id);
        $sender_gender = $room_rent_registration->sender_gender;
        if(!$room_rent_registration->is_accepted) {
            //Check whether can add to room
            $is_accepted = $this->room_repository->updateIncreaseRoomStatus($registered_room->id);
            if(!$is_accepted) {
                $is_updated = false;
                return $is_updated;
            } 

            //Check same gender
            $is_accepted = $this::checkGender($registered_room->id, $sender_gender);
            if(!$is_accepted) {
                $is_updated = false;
                return $is_updated;
            } 
            $room_rent_registration->is_accepted = RoomRentRegistration::STATUS_ACCEPTED;
        } else {
            $room_rent_registration->is_accepted = RoomRentRegistration::STATUS_NOT_ACCEPTED;
            $is_accepted = $this->room_repository->updateDecreaseRoomStatus($registered_room->id);
            if(!$is_accepted) {
                $is_updated = false;
                return $is_updated;
            } 
        }
        //$room_rent_registration->save();
        return $is_updated;
    }
    
    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function checkGender($room_id, $sender_gender) {
        $is_same_gender = false;
        $room = $this->room_repository->show($room_id);
        $renter_in_room = $room->renters->first();
        //Check renter in room
        if(!$renter_in_room) {
            //Check registered user
            $partner_gender = RoomRentRegistration::where('registered_room_id', $room_id)->first()->sender_gender;
            if(!$partner_gender) {
                $is_same_gender = true;
            } else {
                $is_same_gender = $partner_gender == $sender_gender ? true : false;
            }
        } else {
            $partner_gender = $renter_in_room->first()->gender;
            $is_same_gender = $partner_gender == $sender_gender ? true : false;
        }
        return $is_same_gender;
    }
}