<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
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
            'discount' => rand(1, 50),
            'extra_fee' => rand(0, 90),
            'extra_fee_description' => $this->faker->paragraph(),
            'total' => rand(10, 100),
            'month' => rand(1, 12),
            'year' => 2022,
            'effective_from' => date('Y-m-d'),
            'valid_until' => date("Y-m-d", strtotime(date('Y-m-d')."+15 day")),
        ];
    }
}
