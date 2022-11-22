<?php

namespace App\Repositories\Motorbike;

use App\Models\Motorbike;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class MotorbikeRepository implements MotorbikeRepositoryInterface 
{
    public function all() {
        return Motorbike::all();
    }

    public function show($id) {
        return Motorbike::find($id);
    }

    public function store($data, $image) {
        $motorbike = new Motorbike;
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $upload_folder = Motorbike::MOTORBIKE_IMAGE_PUBLIC_FOLDER;
            $path = $image->store($upload_folder, 's3');
            $motorbike->motorbike_image = $path;
        }
        $motorbike->save();
        return $motorbike;
    }

    public function update($data, $id, $image) {
        $motorbike = $this::show($id);
        $motorbike->renter_id = $data['renter_id'];
        $motorbike->license_plate = $data['license_plate'];
        if($image != null) {
            $old_image = $motorbike->motorbike_image;
            if($old_image != null) {
                if(Storage::disk('s3')->exists($old_image)) {
                    Storage::disk('s3')->delete($old_image);
                }
            }
            $upload_folder = Motorbike::MOTORBIKE_IMAGE_PUBLIC_FOLDER;
            $path = $image->store($upload_folder, 's3');
            $motorbike->motorbike_image = $path;
        }
        $motorbike->save();
        return $motorbike;
    }

    public function delete($id) {
        $motorbike = $this::show($id);
        $path = $motorbike->motorbike_image;
        if($path != null) {
            if(Storage::disk('s3')->exists($path)) {
                Storage::disk('s3')->delete($path);
            }
        }
        return $this::show($id)->delete();
    }
}