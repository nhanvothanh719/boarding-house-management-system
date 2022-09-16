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
