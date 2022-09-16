<?php

namespace App\Repositories\Service;

use App\Models\Service;

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
        $service = $this::show($id);
        $is_compulsory_before = $service->is_compulsory;
        if($is_compulsory_before == Service::OPTIONAL && $is_compulsory_before != $data['is_compulsory']) {
            if($this::checkUsed($id)){
                return response([
                    'message' => 'Cannot update this service to compulsory since it is used',
                    'status' => 403,
                ]);
            }
        }
        $service->name = $data['name'];
        $service->description = $data['description'];
        $service->unit = $data['unit'];
        $service->unit_price = $data['unit_price'];
        $service->is_compulsory = $data['is_compulsory'] == true ? '1' : '0';
        $service->save();
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }

    public function allOptionalServices() {
        return Service::where('is_compulsory', 0)->get();
    }

    public function checkUsed($id) {
        $is_used = false;
        if(Service::where('id', $id)->withCount('renters')->get()[0]->renters_count > 0){
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
}