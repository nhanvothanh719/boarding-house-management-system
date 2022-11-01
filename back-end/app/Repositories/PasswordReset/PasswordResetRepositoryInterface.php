<?php

namespace App\Repositories\PasswordReset;

interface PasswordResetRepositoryInterface
{
    public function store(array $data);

    public function updatePassword(array $data);
    public function checkExisted($data);
}