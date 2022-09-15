<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Repositories\RoomCategory\RoomCategoryRepositoryInterface;

class RoomCategoryController extends Controller
{
    protected $category;

    public function __construct(RoomCategoryRepositoryInterface $category) {
        $this->category = $category;
    }

    public function index() {
        return response([
            'status' => 200,
            'allCategories' => $this->category->all(),
        ]);
    }

    public function storeCategory(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories',
            'price' => 'required|numeric|min:100|max:1000',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422,
            ]);
        }
        $category = $this->category->store($request->all());
        return response([
            'message' => 'Successfully create new category',
            'status' => 200,
        ]);
    }

    public function editCategory($id) {
        $category = $this->category->show($id);
        if($category) {
            return response([
                'status' => 200,
                'category' => $category,
            ]);
        }
        else {
            return response([
                'status' => 404,
                'message' => 'No category found',
            ]);
        }
    }

    public function updateCategory(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => ['required','unique:categories,name,'.$id],
            'price' => 'required|numeric|min:100|max:1000',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $category = $this->category->show($id);
        if($category) {
           $category = $this->category->update($request->all(), $id);
            return response([
                'message' => 'Successfully update category',
                'status' => 200,
            ]);
        } else {
            return response([
                'message' => 'No category ID found',
                'status' => 404,
            ]);
        }
    }

    public function deleteCategory($id) {
        $category = $this->category->show($id);
        if($category) {
            if($this->category->checkUsed($id)) {
                return response([
                    'message' => 'Cannot delete this category since it is used',
                    'status' => 403,
                    'test' => $this->category->checkUsed($id),
                ]);
            }
            else {
                $this->category->delete($id);
                return response([
                    'status' => 200,
                    'message' => 'Successfully delete category',
                ]);
            }
        }
        return response([
            'message' => 'No category ID found',
            'status' => 404,
        ]);
    }
}
