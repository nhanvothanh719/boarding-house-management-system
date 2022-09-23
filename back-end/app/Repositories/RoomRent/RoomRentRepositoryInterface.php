<?php

namespace App\Repositories\RoomRent;

interface RoomRentRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);

    public function accept($data);
    public function cancel($id);

    public function checkRentRoom($renter_id);
    public function getRenterRoom($renter_id);
    public function getRenterCurrentRoomPartners($renter_id);
}