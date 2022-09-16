<?php

namespace App\Repositories\ServiceRegistration;

use App\Models\ServiceRegistration;

class ServiceRegistrationRepository implements ServiceRegistrationRepositoryInterface
{
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
        $is_existed = false;
        $check_existed_registration = ServiceRegistration::where([['user_id', $user_id],['service_id', $service_id]])->count();
        if($check_existed_registration > 0) {
            $is_existed = true;
        }
        return $is_existed;
    }
}