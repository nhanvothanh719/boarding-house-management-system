<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Category;
use App\Models\Room;

use App\Http\Requests\CategoryStoreRequest;

class CategoryController extends Controller
{
    public function index() {
        $allCategories = Category::all();
        return response([
            'status' => 200,
            'allCategories' => $allCategories,
        ]);
    }

    public function storeCategory(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:categories',
            'price' => 'required',
        ]);
        if($validator->fails())
        {
            return response([
                'errors' => $validator->messages(),
                'status' => 400,
            ], 200);
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
                'message' => 'No category ID found',
            ]);
        }
    }

    public function updateCategory(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'price' => 'required',
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
            ], 200);
        } else {
            return response([
                'message' => 'No category ID found',
                'status' => 404,
            ], 200);
        }
    }
}
