<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RenterController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\MotorbikeController;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

Route::post('/contact-us', [ContactUsController::class, 'sendContactUsMessage']);
Route::post('/forget-password', [PasswordResetController::class, 'sendEmailToResetPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);  
                
Route::get('/all-available-rooms', [RoomController::class, 'displayAllAvailableRooms']);
Route::get('/room-details/{id}', [RoomController::class, 'getRoomDetails']);

Route::middleware('auth:api')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/get-user-profile', [UserController::class, 'getUser']);
    //Dashboard
    Route::middleware('isAdmin')->group(function(){
        Route::get('/check-authenticated', function() {
            return response(['message' => 'You are in', 'status' => 200], 200);
        });    
        //Category
        Route::get('/all-categories', [CategoryController::class, 'index']);
        Route::post('/store-category', [CategoryController::class, 'storeCategory']);
        Route::get('/edit-category/{id}', [CategoryController::class, 'editCategory']);
        Route::put('/update-category/{id}', [CategoryController::class, 'updateCategory']);
        Route::delete('/delete-category/{id}', [CategoryController::class, 'deleteCategory']);

        //Room
        Route::get('/all-rooms', [RoomController::class, 'index']);
        Route::post('/store-room', [RoomController::class, 'storeRoom']);
        Route::get('/edit-room/{id}', [RoomController::class, 'editRoom']);
        Route::post('/update-room/{id}', [RoomController::class, 'updateRoom']);
        Route::delete('/delete-room/{id}', [RoomController::class, 'deleteRoom']);

        //Renter
        Route::get('/all-renters', [RenterController::class, 'index']);
        Route::post('/store-renter', [RenterController::class, 'storeRenter']);
        Route::get('/edit-renter/{id}', [RenterController::class, 'editRenter']);
        Route::post('/update-renter/{id}', [RenterController::class, 'updateRenter']);
        Route::delete('/delete-renter/{id}', [RenterController::class, 'deleteRenter']);

        //Role
        Route::get('/all-roles', [RoleController::class, 'index']);

        //Motorbike
        Route::get('/all-motorbikes', [MotorbikeController::class, 'index']);
        Route::post('/store-motorbike', [MotorbikeController::class, 'storeMotorbike']);
        Route::get('/edit-motorbike/{id}', [MotorbikeController::class, 'editMotorbike']);
        Route::post('/update-motorbike/{id}', [MotorbikeController::class, 'updateMotorbike']);
        Route::delete('/delete-motorbike/{id}', [MotorbikeController::class, 'deleteMotorbike']);
        Route::get('/all-motorbike_owners', [MotorbikeController::class, 'getMotorbikeOwners']);

        Route::get('/get-name/{id}', [UserController::class, 'getName']);
    });
});



