<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\RoomController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/contact-us', [ContactUsController::class, 'sendContactUsMessage']);
Route::post('/forget-password', [PasswordResetController::class, 'sendEmailToResetPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);                  
Route::get('/get-user-profile', [UserController::class, 'getUser'])->middleware('auth:api'); //Get user data in case the user did login

Route::get('/all-available-rooms', [RoomController::class, 'displayAllAvailableRooms']);
Route::get('/room-details/{id}', [RoomController::class, 'getRoomDetails']);

