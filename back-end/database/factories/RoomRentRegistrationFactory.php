<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomRentRegistration>
 */
class RoomRentRegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'sender_name' => $this->faker->name(),
            'sender_gender' => rand(0, 1),
            'sender_email' => $this->faker->safeEmail(),
            'sender_phone_number' => $this->faker->unique()->numerify('096#######'),
            'registered_room_id' => rand(1, 50),
            'is_accepted' => 0,
        ];
    }
}
