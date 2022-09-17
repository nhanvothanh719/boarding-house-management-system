<?php

namespace App\Repositories\Role;

use App\Models\Role;

class RoleRepository implements RoleRepositoryInterface 
{
    public function all() {
        return Role::all();
    }
}