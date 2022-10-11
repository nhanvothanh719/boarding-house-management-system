<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Balance>
 */
class BalanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'description' => $this->faker->unique()->paragraph(),
            'is_income' => rand(0, 1),
            'amount' => rand(1, 1000) / 10,
            'occurred_on' => date('Y-m-d'),
        ];
    }
}
