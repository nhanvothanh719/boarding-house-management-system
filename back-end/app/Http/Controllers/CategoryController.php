<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Category;
use App\Models\Room;

class CategoryController extends Controller
{
    public function index() {
        $all_categories = Category::all();
        return response([
            'status' => 200,
            'allCategories' => $all_categories,
        ]);
    }

    public function storeCategory(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories',
            'price' => 'required|numeric',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 404,
            ]);
        }
        try {
            $category = Category::create([
                'name' => $request->name,
                'price' => $request->price,
                'description' => $request->description,
            ]);
            return response([
                'message' => 'Successfully create new category',
                'category' => $category,
                'status' => 200,
            ], 200);
        }
        catch(Exception $exception) {
            return response([
                'message' => $exception->getMessage(),
                'status' => 400,
            ], 400);
        }
    }

    public function editCategory($id) {
        $category = Category::find($id);
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
            'name' => 'required',
            'price' => 'required|numeric',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 422, //Unprocessable entity
            ]);
        }
        $category = Category::find($id);
        if($category) {
            $category->name = $request->name;
            $category->price = $request->price;
            $category->description = $request->description;
            $category->save();
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
        $category = Category::find($id);
        if($category) {
            $rooms_in_category = Room::where('category_id', $id)->count();
            if($rooms_in_category > 0) {
                return response([
                    'message' => 'Cannot delete this category since it is used',
                    'status' => 404,
                ]);
            }
            else {
                $category->delete();
                return response([
                    'status' => 200,
                    'message' => 'Successfully delete category',
                ]);
            }
        } else {
            return response([
                'message' => 'No category ID found',
                'status' => 404,
            ]);
        }
    }
}
