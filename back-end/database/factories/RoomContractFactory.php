<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomContract>
 */
class RoomContractFactory extends Factory
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
            'effective_from' => date('Y-m-d'),
            'effective_until' => date('Y-m-d', strtotime(' +50 year')),
            'deposit_amount' => rand(100, 500),
            'owner_signature' => UploadedFile::fake()->image('owner_sig.jpg'),
            'renter_signature' => UploadedFile::fake()->image('renter_sig.jpg'),
        ];
    }
}
