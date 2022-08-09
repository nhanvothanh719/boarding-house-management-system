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
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceRegistrationController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BalanceController;
use App\Http\Controllers\BreachController;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

Route::post('/contact-us', [ContactUsController::class, 'sendContactUsMessage']);
Route::post('/forget-password', [PasswordResetController::class, 'sendEmailToResetPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);  
                
Route::get('/all-available-rooms', [RoomController::class, 'displayAllAvailableRooms']);
Route::get('/available-room-details/{id}', [RoomController::class, 'getAvailableRoomDetails']);

Route::middleware('auth:api')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/get-user-profile', [UserController::class, 'getUser']);
    //Dashboard
    Route::middleware('isAdmin')->group(function(){
        Route::get('/check-admin-authenticated', function() {
            return response(['message' => 'Login successfully. You are the admin', 'status' => 200]);
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
        Route::get('/all-statuses', [RoomController::class, 'getAllRoomStatuses']);
        Route::get('/all-room_rents', [RoomController::class, 'getAllRoomRents']);
        Route::post('/rent-room', [RoomController::class, 'rentRoom']);
        Route::delete('/cancel-rent-room/{id}', [RoomController::class, 'cancelRentRoom']);
        Route::get('/room-details/{id}', [RoomController::class, 'getRoomDetails']);

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

        //Service
        Route::get('/all-services', [ServiceController::class, 'index']);
        Route::post('/store-service', [ServiceController::class, 'storeService']);
        Route::get('/edit-service/{id}', [ServiceController::class, 'editService']);
        Route::put('/update-service/{id}', [ServiceController::class, 'updateService']);
        Route::delete('/delete-service/{id}', [ServiceController::class, 'deleteService']);
        Route::get('/all-optional-services', [ServiceController::class, 'getOptionalServices']);
        
        Route::get('/all-registrations', [ServiceRegistrationController::class, 'index']);
        Route::post('/register-service', [ServiceRegistrationController::class, 'registerService']);
        Route::delete('/unregister-service/{id}', [ServiceRegistrationController::class, 'unregisterService']);
        
        //Invoice
        Route::get('/all-invoices', [InvoiceController::class, 'index']);
        Route::post('/store-invoice/{id}', [InvoiceController::class, 'storeInvoice']);
        Route::get('/edit-invoice/{id}', [InvoiceController::class, 'editInvoice']);
        Route::put('/update-invoice/{id}', [InvoiceController::class, 'updateInvoice']);
        Route::delete('/delete-invoice/{id}', [InvoiceController::class, 'deleteInvoice']);
        Route::get('/all-registered_services/{id}', [InvoiceController::class, 'getRegisteredServices']);
        Route::post('/create-temporary-invoice/{id}', [InvoiceController::class, 'createTemporaryInvoice']);
        Route::post('/update-service-quantity/{service_id}/{value}',[InvoiceController::class, 'updateServiceQuantity']);
        Route::get('/send-invoice/{id}', [InvoiceController::class, 'sendInvoice']);
        Route::get('/get-renter-invoices/{id}', [InvoiceController::class, 'getRenterInvoices']);

        Route::post('/make-payment/{id}', [PaymentController::class, 'makePayment']);

        //Announcement
        Route::post('send-announcement', [AnnouncementController::class, 'sendAnnouncement']);

        //Balance
        Route::get('/get-balance', [BalanceController::class, 'index']);
        Route::post('/update-balance', [BalanceController::class, 'updateBalance']);
        Route::get('/recent-balance-changes', [BalanceController::class, 'calculateBalance']);
        Route::get('/get-pie-chart-data', [BalanceController::class, 'getDataForPieChart']);
        Route::put('/update-balance-change/{id}', [BalanceController::class, 'updateBalanceChange']);
        Route::delete('/delete-balance-change/{id}', [BalanceController::class, 'deleteBalanceChange']);

        //Breach
        Route::get('/all-breaches', [BreachController::class, 'index']);
        Route::post('/store-breach', [BreachController::class, 'storeBreach']);
        Route::put('/update-breach/{id}', [BreachController::class, 'updateBreach']);
        Route::delete('/delete-breach/{id}', [BreachController::class, 'deleteBreach']);

        Route::get('/all-breach-histories', [BreachController::class, 'getBreachHistories']);
        Route::post('/store-breach-history', [BreachController::class, 'storeBreachHistory']);
        Route::put('/update-breach-history/{id}', [BreachController::class, 'updateBreachHistory']);
        Route::delete('/delete-breach-history/{id}', [BreachController::class, 'deleteBreach']);
    });
});



