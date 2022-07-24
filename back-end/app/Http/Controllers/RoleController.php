<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Role;

class RoleController extends Controller
{
    public function index() {
        $allRoles = Role::all();
        return response([
            'status' => 200,
            'allRoles' => $allRoles,
        ]);
    }
}
