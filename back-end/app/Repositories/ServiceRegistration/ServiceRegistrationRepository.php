<?php

namespace App\Repositories\ServiceRegistration;

use App\Models\ServiceRegistration;

use App\Repositories\User\UserRepositoryInterface;

class ServiceRegistrationRepository implements ServiceRegistrationRepositoryInterface
{
    private $user_repository;

    public function __construct(UserRepositoryInterface $user_repository) 
    {
        $this->user_repository = $user_repository;
    }

    public function all() {
        return ServiceRegistration::all();
    }

    public function show($id) {
        return ServiceRegistration::find($id);
    }

    public function store($data) {
        $service_registration = ServiceRegistration::create([
            'user_id' => $data['user_id'],
            'service_id' => $data['service_id'],
        ]);
        return $service_registration;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function checkExisted($user_id, $service_id) {
        return ServiceRegistration::where([['user_id', $user_id],['service_id', $service_id]])->count() > 0 ? true : false;
    }

    public function checkAdminRole($id) {
        return $this->user_repository->checkAdminRole($id);
    }
}