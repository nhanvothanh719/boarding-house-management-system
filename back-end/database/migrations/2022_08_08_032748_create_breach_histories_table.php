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
        Schema::create('breach_histories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('breach_id')->unsigned();
            $table->foreign('breach_id')->references('id')->on('breaches');
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
        Schema::dropIfExists('breach_histories');
    }
};
