<?php

namespace App\Repositories\Motorbike;

use App\Helpers\CustomHelper;

use App\Models\Motorbike;

class MotorbikeRepository implements MotorbikeRepositoryInterface 
{
    public function all() {
        return Motorbike::all();
    }

    public function show($id) {
        return Motorbike::find($id);
    }

    public function store($data, $image = null) {
        $motorbike = new Motorbike;
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $upload_folder = Motorbike::motorbike_image_public_folder;
            $motorbike->motorbike_image = CustomHelper::addImage($image, $upload_folder);
        }
        $motorbike->save();
        return $motorbike;
    }

    public function update($data, $id, $image = null) {
        $motorbike = $this::show($id);
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $old_image = $motorbike->motorbike_image;
            $upload_folder = Motorbike::motorbike_image_public_folder;
            $motorbike->motorbike_image = CustomHelper::updateImage($old_image, $image, $upload_folder);
        }
        $motorbike->save();
        return $motorbike;
    }

    public function delete($id) {
        return $this::show($id)->delete();
    }
}