<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Repositories\Role\RoleRepositoryInterface;

class RoleController extends Controller
{
    protected $role;

    public function __construct(RoleRepositoryInterface $role) {
        $this->role = $role;
    }

    public function index() {
        return response([
            'status' => 200,
            'allRoles' => $this->role->all(),
        ]);
    }
}
