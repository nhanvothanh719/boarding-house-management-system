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
        $room_rent_registration->save();
        return $is_updated;
    }
    
    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function checkGender($room_id, $sender_gender) {
        $room = $this->room_repository->show($room_id);
        $room_rent = $room->rents->first();
        //Check renter in room
        if($room_rent == null) {
            //Check registered user
            $previous_sender = RoomRentRegistration::where('registered_room_id', $room_id)->first();
            if(!$previous_sender) {
                return true;
            }
            $partner_gender = $previous_sender->sender_gender;
            return $partner_gender == $sender_gender ? true : false; 
        } else {
            $renter_in_room = $room_rent->renter;
            $partner_gender = $renter_in_room->gender;
            return $partner_gender == $sender_gender ? true : false;
        }
    }
}