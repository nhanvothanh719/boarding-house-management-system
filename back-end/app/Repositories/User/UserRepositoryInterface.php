<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data, $generated_password, $avatar);
    public function update(array $data, $id);
    public function delete($id);

    public function getCurrentUser();
    public function storeUserAvatar($id, $avatar);
    public function updateUserAvatar($id, $old_avatar, $new_avatar);
    public function lockUserAccount($id);
    public function updateImportantInfo($data, $id);
}