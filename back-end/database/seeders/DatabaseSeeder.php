<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::factory(15)->create();
        \App\Models\Breach::factory(15)->create();
        \App\Models\Service::factory(15)->create();
        \App\Models\Balance::factory(15)->create();
        $this->call([
            CategoriesTableSeeder::class,
        ]);
    }
}
