<?php

namespace App\Repositories\ServiceRegistration;

interface ServiceRegistrationRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data);
    public function delete($id);

    public function checkExisted($user_id, $service_id);
}