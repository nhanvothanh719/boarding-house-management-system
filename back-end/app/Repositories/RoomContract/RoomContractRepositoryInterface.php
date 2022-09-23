<?php

namespace App\Repositories\RoomContract;

interface RoomContractRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data, $owner_signature, $renter_signature);
    public function update(array $data, $id);
    public function delete($id);

    public function updateSignatures($id, $owner_signature, $renter_signature);
    public function findRoomContractByRenterId($id);
}