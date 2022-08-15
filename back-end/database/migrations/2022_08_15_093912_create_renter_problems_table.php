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
        Schema::create('renter_problems', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('renter_id')->unsigned();
            $table->foreign('renter_id')->references('id')->on('users');
            $table->string('title');
            $table->text('description');
            $table->tinyInteger('severity_level');
            $table->tinyInteger('status');
            $table->bigInteger('replied_by')->unsigned()->nullable();
            $table->foreign('replied_by')->references('id')->on('users');
            $table->text('reply_content')->nullable();
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
        Schema::dropIfExists('renter_problems');
    }
};
