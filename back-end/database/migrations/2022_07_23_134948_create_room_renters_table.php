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
        Schema::create('room_renters', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('room_id')->unsigned();
            $table->foreign('room_id')->references('id')->on('rooms');
            $table->bigInteger('renter_id')->unsigned();
            $table->foreign('renter_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('room_renters');
    }
};
