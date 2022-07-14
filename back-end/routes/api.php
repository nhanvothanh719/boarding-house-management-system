<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\CategoryController;

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
    });
});



