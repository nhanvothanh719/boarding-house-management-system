<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Role;

class RoleController extends Controller
{
    public function index() {
        $all_roles = Role::all();
        return response([
            'status' => 200,
            'allRoles' => $all_roles,
        ]);
    }
}
