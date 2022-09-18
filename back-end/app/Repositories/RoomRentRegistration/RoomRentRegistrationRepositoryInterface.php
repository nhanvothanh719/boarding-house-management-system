<?php

namespace App\Repositories\RoomRentRegistration;

interface RoomRentRegistrationRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function accept($id);
    public function delete($id);
}