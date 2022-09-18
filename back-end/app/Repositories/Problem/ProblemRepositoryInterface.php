<?php

namespace App\Repositories\Problem;

interface ProblemRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function update(array $data, $id);
    public function delete($id);

    public function updateStatus($data, $id);
    public function reply($data, $id);
    public function findByRenterId($id);
}