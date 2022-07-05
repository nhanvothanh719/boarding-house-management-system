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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->char('number', 3);
            $table->tinyInteger('status')->unsigned();
            $table->text('description');
            $table->float('area');
            $table->tinyInteger('hasConditioner')->unsigned()->default(0);
            $table->tinyInteger('hasFridge')->unsigned()->default(0);
            $table->tinyInteger('hasWardrobe')->unsigned()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms');
    }
};
