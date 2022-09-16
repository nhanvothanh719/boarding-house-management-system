<?php

namespace App\Repositories\Service;

interface ServiceRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function checkUsed($id);
    public function checkCompulsory($id);
}