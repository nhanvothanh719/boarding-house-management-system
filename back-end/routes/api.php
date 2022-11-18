<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\AvailableRoomController;
use App\Http\Controllers\RoomRentRegistrationController;

use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\RoomCategoryController;
use App\Http\Controllers\Admin\RenterController;
use App\Http\Controllers\Admin\MotorbikeController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ServiceRegistrationController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\BalanceController;
use App\Http\Controllers\Admin\BreachController;
use App\Http\Controllers\Admin\BreachHistoryController;
use App\Http\Controllers\Admin\RoomContractController;
use App\Http\Controllers\Admin\ProblemController;
use App\Http\Controllers\Admin\RoomRentController;
use App\Http\Controllers\Admin\PaymentController;

use App\Http\Controllers\Renter\RenterBreachController;
use App\Http\Controllers\Renter\RenterInvoiceController;
use App\Http\Controllers\Renter\RenterProblemController;
use App\Http\Controllers\Renter\RenterServiceController;
use App\Http\Controllers\Renter\RenterRoomContractController;
use App\Http\Controllers\Renter\RenterBreachHistoryController;
use App\Http\Controllers\Renter\RenterInfoController;
use App\Http\Controllers\Renter\RenterPaymentController;
use App\Http\Controllers\Renter\RenterRoomRentController;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/contact-us', [ContactUsController::class, 'sendContactUsMessage']);
Route::post('/forget-password', [PasswordResetController::class, 'sendEmailToResetPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);  
                
Route::get('/all-available-rooms', [AvailableRoomController::class, 'displayAllAvailableRooms']);
Route::get('/available-room-details/{id}', [AvailableRoomController::class, 'getAvailableRoomDetails']);

Route::post('/store-room-rent-registration', [RoomRentRegistrationController::class, 'storeRoomRentRegistration']);

Route::middleware('auth:api')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/get-user-profile', [UserController::class, 'getUserProfile']);
    Route::put('/update-user-profile', [UserController::class, 'updateUserProfile']);
    Route::post('/update-user-avatar', [UserController::class, 'updateUserAvatar']);

    Route::middleware('isRenter')->group(function(){
        Route::get('/check-renter-authenticated', function() {
            return response(['message' => 'Login successfully. You are the renter', 'status' => 200]);
        }); 

        Route::get('/get-renter-breaches', [RenterInfoController::class, 'getRenterBreaches']);
        
        Route::get('/get-renter-room-info', [RenterRoomRentController::class, 'getRenterRoomInfo']);

        Route::get('/get-invoice-details/{id}', [RenterInvoiceController::class, 'getInvoiceDetails']);
        Route::get('/all-renter-invoices', [RenterInvoiceController::class, 'getRenterInvoices']);
        Route::get('/get-renter-room-price', [UserController::class, 'getRenterRoomPrice']);

        Route::post('/make-payment/{id}', [RenterPaymentController::class, 'payInvoice']);
        
        Route::get('/all-renter-problems', [RenterProblemController::class, 'getRenterProblems']);
        Route::post('/store-renter-problem', [RenterProblemController::class, 'storeProblem']);
        Route::get('/get-renter-problem-details/{id}', [RenterProblemController::class, 'getProblemDetails']);
        Route::put('/update-renter-problem/{id}', [RenterProblemController::class, 'updateProblem']);
        Route::delete('/delete-renter-problem/{id}', [RenterProblemController::class, 'deleteProblem']);

        Route::get('/all-renter-registered-services', [RenterServiceController::class, 'getRegisteredServices']);

        Route::get('/get-renter-room-contract', [RenterRoomContractController::class, 'getRenterRoomContract']);

        Route::get('/get-breach-details/{id}', [RenterBreachController::class, 'getBreachDetails']);
        
        Route::get('/get-renter-breach-histories/{id}', [RenterBreachHistoryController::class, 'getRenterBreachHistories']);
    });

    //Dashboard
    Route::middleware('isAdmin')->group(function(){

        Route::get('/check-admin-authenticated', function() {
            return response(['message' => 'Login successfully. You are the admin', 'status' => 200]);
        });

        //User
        Route::get('/all-users', [UserController::class, 'index']);
        Route::post('/store-user', [UserController::class, 'storeUser']);
        Route::get('/edit-user/{id}', [UserController::class, 'editUser']);
        Route::post('/update-user/{id}', [UserController::class, 'updateUser']);
        Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);
        Route::put('/lock-user-account/{id}', [UserController::class, 'lockUserAccount']);
        Route::get('/get-user-name/{id}', [UserController::class, 'getName']);

        //Category
        Route::get('/all-categories', [RoomCategoryController::class, 'index']);
        Route::post('/store-category', [RoomCategoryController::class, 'storeCategory']);
        Route::get('/edit-category/{id}', [RoomCategoryController::class, 'editCategory']);
        Route::put('/update-category/{id}', [RoomCategoryController::class, 'updateCategory']);
        Route::delete('/delete-category/{id}', [RoomCategoryController::class, 'deleteCategory']);

        //Room
        Route::get('/count-rooms', [RoomController::class, 'countRooms']);
        Route::get('/all-rooms', [RoomController::class, 'index']);
        Route::post('/store-room', [RoomController::class, 'storeRoom']);
        Route::get('/edit-room/{id}', [RoomController::class, 'editRoom']);
        Route::post('/update-room/{id}', [RoomController::class, 'updateRoom']);
        Route::delete('/delete-room/{id}', [RoomController::class, 'deleteRoom']);
        Route::get('/count-rooms-by-status', [RoomController::class, 'countRoomsByStatus']);

        //Room rent
        Route::get('/all-room-rents', [RoomRentController::class, 'index']);
        Route::post('/store-room-rent', [RoomRentController::class, 'storeRoomRent']);
        Route::delete('/cancel-room-rent/{id}', [RoomRentController::class, 'cancelRoomRent']);

        //Renter
        Route::get('/all-renters', [RenterController::class, 'index']);
        Route::get('/get-renter-breaches/{id}', [RenterController::class, 'getRenterBreachHistories']);
        Route::get('/all-registered-services/{id}', [RenterController::class, 'getRegisteredServices']);
        Route::get('/get-renter-invoices/{id}', [RenterController::class, 'getRenterInvoices']);
        Route::get('/get-renter-total-used-services-amount/{id}', [RenterController::class, 'countRenterTotalUsedServicesAmount']);
        Route::get('/count-renters-by-gender', [RenterController::class, 'countRentersByGender']);
        Route::get('/count-renter-breaches/{id}', [RenterController::class, 'countRenterBreaches']);
        Route::get('/count-renters', [RenterController::class, 'countRenters']);
        Route::post('/send-announcement', [RenterController::class, 'sendAnnouncement']);

        //Motorbike
        Route::get('/all-motorbikes', [MotorbikeController::class, 'index']);
        Route::post('/store-motorbike', [MotorbikeController::class, 'storeMotorbike']);
        Route::get('/edit-motorbike/{id}', [MotorbikeController::class, 'editMotorbike']);
        Route::post('/update-motorbike/{id}', [MotorbikeController::class, 'updateMotorbike']);
        Route::delete('/delete-motorbike/{id}', [MotorbikeController::class, 'deleteMotorbike']);

        //Service
        Route::get('/all-services', [ServiceController::class, 'index']);
        Route::post('/store-service', [ServiceController::class, 'storeService']);
        Route::get('/edit-service/{id}', [ServiceController::class, 'editService']);
        Route::put('/update-service/{id}', [ServiceController::class, 'updateService']);
        Route::delete('/delete-service/{id}', [ServiceController::class, 'deleteService']);
        Route::get('/all-optional-services', [ServiceController::class, 'getOptionalServices']);
        Route::get('/all-compulsory-services', [ServiceController::class, 'getCompulsoryServices']);
        Route::get('/count-used-services', [ServiceController::class, 'countUsedServices']);
        
        Route::get('/all-service-registrations', [ServiceRegistrationController::class, 'index']);
        Route::post('/register-service', [ServiceRegistrationController::class, 'registerService']);
        Route::delete('/unregister-service/{id}', [ServiceRegistrationController::class, 'unregisterService']);
        
        //Invoice
        Route::get('/check-can-create-invoice/{id}', [UserController::class, 'checkCanCreateInvoice']);
        Route::get('/get-room-price/{id}', [UserController::class, 'getRoomPrice']);

        Route::get('/all-invoices', [InvoiceController::class, 'index']);
        Route::post('/store-invoice/{id}', [InvoiceController::class, 'storeInvoice']);
        Route::get('/edit-invoice/{id}', [InvoiceController::class, 'editInvoice']);
        Route::put('/update-invoice/{id}', [InvoiceController::class, 'updateInvoice']);
        Route::delete('/delete-invoice/{id}', [InvoiceController::class, 'deleteInvoice']);
        Route::get('/send-invoice/{id}', [InvoiceController::class, 'sendInvoice']);

        //Payment
        Route::post('/pay-by-cash/{id}', [PaymentController::class, 'payInvoice']);
        Route::get('/get-paid-invoices-ratio', [PaymentController::class, 'getPaidInvoicesRatio']); //

        //Balance
        Route::get('/get-balance', [BalanceController::class, 'index']);
        Route::post('/update-balance', [BalanceController::class, 'updateBalance']);
        Route::get('/get-recent-balance-changes', [BalanceController::class, 'calculateBalance']);
        Route::get('/get-expense-ratio', [BalanceController::class, 'getExpenseRatio']); //
        Route::get('/edit-balance-change/{id}', [BalanceController::class, 'editBalanceChange']);
        Route::put('/update-balance-change/{id}', [BalanceController::class, 'updateBalanceChange']);
        Route::delete('/delete-balance-change/{id}', [BalanceController::class, 'deleteBalanceChange']);
        Route::get('/get-earned-amount', [BalanceController::class, 'getEarnedAmount']);

        //Breach
        Route::get('/all-breaches', [BreachController::class, 'index']);
        Route::post('/store-breach', [BreachController::class, 'storeBreach']);
        Route::get('/edit-breach/{id}', [BreachController::class, 'editBreach']);
        Route::put('/update-breach/{id}', [BreachController::class, 'updateBreach']);
        Route::delete('/delete-breach/{id}', [BreachController::class, 'deleteBreach']);
        Route::get('/get-total-number-breach-made', [BreachController::class, 'calculateTotalNumberBreachMade']);

        //Breach history
        Route::get('/all-breach-histories', [BreachHistoryController::class, 'getBreachHistories']);
        Route::post('/store-breach-history', [BreachHistoryController::class, 'storeBreachHistory']);
        Route::delete('/delete-breach-history/{id}', [BreachHistoryController::class, 'deleteBreachHistory']);
        Route::get('/report-breaches', [BreachHistoryController::class, 'reportBreaches']);

        //Room contract
        Route::get('/all-room-contracts', [RoomContractController::class, 'index']);
        Route::post('/store-room-contract', [RoomContractController::class, 'storeRoomContract']);
        Route::put('/update-room-contract/{id}', [RoomContractController::class, 'updateRoomContract']);
        Route::delete('/delete-room-contract/{id}', [RoomContractController::class, 'deleteRoomContract']);
        Route::get('/get-room-contract-details/{id}', [RoomContractController::class, 'getRoomContractDetails']);
        Route::post('/update-signatures/{id}', [RoomContractController::class, 'updateSignatures']);

        //Problem
        Route::get('/all-problems', [ProblemController::class, 'index']);
        Route::put('/reply-problem/{id}', [ProblemController::class, 'replyProblem']);
        Route::delete('/delete-problem/{id}', [ProblemController::class, 'deleteProblem']);
        Route::get('/get-problem-details/{id}', [ProblemController::class, 'getProblemDetails']);
        Route::put('/update-problem-status/{id}', [ProblemController::class, 'updateProblemStatus']);

        //Room rent registration
        Route::get('/all-room-rent-registrations', [RoomRentRegistrationController::class, 'index']);
        Route::delete('/delete-room-rent-registration/{id}', [RoomRentRegistrationController::class, 'deleteRoomRentRegistration']);
        Route::put('/accept-registration-request/{id}', [RoomRentRegistrationController::class, 'acceptRegistrationRequest']);
    });
});



