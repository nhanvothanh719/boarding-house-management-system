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
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('effective_from');
            $table->dropColumn('valid_until');
        });

        Schema::table('room_contracts', function (Blueprint $table) {
            $table->dropColumn('effective_from');
            $table->dropColumn('effective_until');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->date('effective_from')->default(date('Y-m-d', strtotime(' -5 days')));
            $table->date('valid_until')->default(date('Y-m-d', strtotime(' +2 days')));
        });

        Schema::table('room_contracts', function (Blueprint $table) {
            $table->date('effective_from')->default(date('Y-m-d', strtotime(' -1 months')));
            $table->date('effective_until')->default(date('Y-m-d', strtotime(' +1 months')));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('date', function (Blueprint $table) {
            //
        });
    }
};
