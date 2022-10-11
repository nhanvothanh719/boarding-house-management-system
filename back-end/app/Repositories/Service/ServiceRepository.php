<?php

namespace App\Repositories\Service;

use App\Models\Service;

use Illuminate\Database\Eloquent\Builder;

class ServiceRepository implements ServiceRepositoryInterface
{
    public function all() {
        return Service::all();
    }

    public function show($id) {
        return Service::find($id);
    }

    public function store($data) {
        $service = Service::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'is_compulsory' => $data['is_compulsory'] == true ? '1' : '0',
            'unit' => $data['unit'],
            'unit_price' => $data['unit_price'],
        ]);
        return $service;
    }

    public function update($data, $id) {
        $is_updated = true;
        $service = $this::show($id);
        $is_compulsory_before = $service->is_compulsory;
        if($is_compulsory_before == Service::OPTIONAL && $is_compulsory_before != $data['is_compulsory']) {
            if($this::checkUsed($id)){
                $is_updated = false;
                return $is_updated;
            }
        }
        $service->name = $data['name'];
        $service->description = $data['description'];
        $service->unit = $data['unit'];
        $service->unit_price = $data['unit_price'];
        $service->is_compulsory = $data['is_compulsory'] == true ? '1' : '0';
        $service->save();
        return $is_updated;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function checkUsed($id) {
        $is_used = false;
        if(Service::where('id', $id)->withCount('users')->get()[0]->users_count > 0){
            $is_used = true;
        }
        return $is_used;
    }

    public function checkCompulsory($id) {
        $is_compulsory = false;
        if($this::show($id)->is_compulsory == Service::COMPULSORY) {
            $is_compulsory = true;
        }
        return $is_compulsory;
    }

    public function getAllOptionalServices() {
        return Service::where('is_compulsory', Service::OPTIONAL)->get();
    }

    public function getAllCompulsoryServices() {
        $compulsory_services = array();
        $all_services = Service::where('is_compulsory', Service::COMPULSORY)->get();
        foreach($all_services as $service) {
            $service->quantity = 0;
            array_push($compulsory_services, $service);
        }
        return $compulsory_services;
    }

    public function countUsedServices() {
        return Service::withCount('users')->get();
    }

    public function getRegisteredServices($renter_id) {
        //select * from services WHERE EXISTS(SELECT * FROM services WHERE service_registrations(or users).user_id = $renter_id);
        return Service::whereHas('users', function (Builder $query) use($renter_id) {
            $query->where('user_id', $renter_id);
           })->get();
    }
}