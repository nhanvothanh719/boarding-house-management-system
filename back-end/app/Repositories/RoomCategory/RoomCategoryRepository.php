<?php

namespace App\Repositories\RoomCategory;

use App\Models\Category;

class RoomCategoryRepository implements RoomCategoryRepositoryInterface
{
    public function all() {
        return Category::all();
    }

    public function show($id) {
        return Category::find($id);
    }

    public function store($data) {
        return Category::create([
            'name' => $data['name'],
            'price' => $data['price'],
            'description' => $data['description'],
        ]);
    }

    public function update($data, $id) {
        $category = $this::show($id);
        $category->name = $data['name'];
        $category->price = $data['price'];
        $category->description = $data['description'];
        return $category->save();
    }

    public function delete($id) {
        $category = $this::show($id);
        return $category->delete();
    }

    public function checkUsed($id) {
        $is_used = false;
        if(Category::where('id', $id)->withCount('rooms')->get()[0]->rooms_count > 0){
            $is_used = true;
        }
        return $is_used;
    }
}