<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'number' => $this->faker->unique()->numerify('###'),
            'area' => rand(200, 400),
            'category_id' => rand(1, 50),
            'description' => $this->faker->paragraph(),
            'status' => rand(1, 3),
            'has_conditioner' => rand(0, 1),
            'has_fridge' => rand(0, 1),
            'has_wardrobe' => rand(0, 1),
        ];
    }
}
