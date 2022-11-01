<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Problem>
 */
class ProblemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'renter_id' => rand(1, 50),
            'title' => $this->faker->unique()->numerify('Problem ###'),
            'description' => $this->faker->paragraph(),
            'severity_level' => rand(1, 3),
            'status' => 1,
            'replied_by' => null,
            'reply_text' => null,
        ];
    }
}
