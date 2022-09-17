<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Repositories\Room\RoomRepository;
use App\Repositories\Room\RoomRepositoryInterface;
use App\Repositories\RoomCategory\RoomCategoryRepository;
use App\Repositories\RoomCategory\RoomCategoryRepositoryInterface;
use App\Repositories\Balance\BalanceRepository;
use App\Repositories\Balance\BalanceRepositoryInterface;
use App\Repositories\Motorbike\MotorbikeRepository;
use App\Repositories\Motorbike\MotorbikeRepositoryInterface;
use App\Repositories\Breach\BreachRepository;
use App\Repositories\Breach\BreachRepositoryInterface;
use App\Repositories\BreachHistory\BreachHistoryRepository;
use App\Repositories\BreachHistory\BreachHistoryRepositoryInterface;
use App\Repositories\Invoice\InvoiceRepository;
use App\Repositories\Invoice\InvoiceRepositoryInterface;
use App\Repositories\Service\ServiceRepository;
use App\Repositories\Service\ServiceRepositoryInterface;
use App\Repositories\ServiceRegistration\ServiceRegistrationRepository;
use App\Repositories\ServiceRegistration\ServiceRegistrationRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\RoomContract\RoomContractRepository;
use App\Repositories\RoomContract\RoomContractRepositoryInterface;
use App\Repositories\RoomRentRegistration\RoomRentRegistrationRepository;
use App\Repositories\RoomRentRegistration\RoomRentRegistrationRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(RoomRepositoryInterface::class, RoomRepository::class);
        $this->app->bind(RoomCategoryRepositoryInterface::class, RoomCategoryRepository::class);
        $this->app->bind(BalanceRepositoryInterface::class, BalanceRepository::class);
        $this->app->bind(MotorbikeRepositoryInterface::class, MotorbikeRepository::class);
        $this->app->bind(BreachRepositoryInterface::class, BreachRepository::class);
        $this->app->bind(BreachHistoryRepositoryInterface::class, BreachHistoryRepository::class);
        $this->app->bind(ServiceRepositoryInterface::class, ServiceRepository::class);
        $this->app->bind(ServiceRegistrationRepositoryInterface::class, ServiceRegistrationRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(RoomContractRepositoryInterface::class, RoomContractRepository::class);
        $this->app->bind(RoomRentRegistrationRepositoryInterface::class, RoomRentRegistrationRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
