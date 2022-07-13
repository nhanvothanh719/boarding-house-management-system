<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Category;

use App\Http\Requests\CategoryStoreRequest;

class CategoryController extends Controller
{
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
}
