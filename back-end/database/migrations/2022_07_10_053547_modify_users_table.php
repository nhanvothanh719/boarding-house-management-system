<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->tinyInteger('gender')->unsigned();
            $table->date('date_of_birth')->default(now());
            $table->char('id_card_number', 10)->unique();
            $table->char('phone_number', 10);
            $table->string('occupation');
            $table->text('permanent_address');
            $table->string('profile_picture')->nullable();
            $table->tinyInteger('role_id')->unsigned()->default(0);
            $table->tinyInteger('is_locked')->unsigned()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
