<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function all();
    public function show($id);
    public function store(array $data, $generated_password, $avatar);
    public function update(array $data, $id);
    public function delete($id);

    public function checkCanLogin($data);
    public function checkLockedAccount($id);
    public function checkAdmin($id);
    public function generateTokenWithScope($id);

    public function getCurrentUser();
    public function storeUserAvatar($id, $avatar);
    public function updateUserAvatar($id, $old_avatar, $new_avatar);
    public function lockUserAccount($id);
    public function updateImportantInfo($data, $id);
    public function updatePassword($email, $new_hash_password);
    public function checkAdminRole($id);
    
    public function allRenters();
    public function getBreachHistories($id);
    public function getRegisteredServices($id);
    public function sendAnnouncement($data);
}