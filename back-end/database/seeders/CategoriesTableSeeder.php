<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert(array(
            array(
            'name' => "Floor 1",
            'description' => 'This category includes rooms on the ground floor (first floor).',
            'price' => 400,
            ),
            array(
            'name' => "Floor 2",
            'description' => 'This category includes rooms on the second floor.',
            'price' => 370,
            ),
            array(
            'name' => "Floor 3",
            'description' => 'This category includes rooms on the third floor.',
            'price' => 350,
            ),
        ));
    }
}
