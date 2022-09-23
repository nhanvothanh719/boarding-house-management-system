<?php

namespace App\Repositories\Motorbike;

interface MotorbikeRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data, $image);
    public function update(array $data, $id);
    public function delete($id);
}