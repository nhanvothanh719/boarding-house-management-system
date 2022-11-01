<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PaymentHistory>
 */
class PaymentHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'invoice_id' => rand(1, 50),
            'payment_id' => $this->faker->unique()->isbn10(),
            'made_by' => rand(1, 50),
            'made_at' => date('Y-m-d H:i:s'),
            'payment_method' => 1,
        ];
    }
}
