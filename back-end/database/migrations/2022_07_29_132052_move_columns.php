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
        Schema::table('invoice_details', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropColumn('invoice_id');
        });
        Schema::table('extra_fees', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropColumn('invoice_id');
        });
        Schema::table('invoices', function (Blueprint $table) {
            $table->bigInteger('invoice_details_id')->unsigned()->after('is_paid');
            $table->foreign('invoice_details_id')->references('id')->on('invoice_details');
            $table->bigInteger('extra_fee_id')->unsigned()->after('invoice_details_id');
            $table->foreign('extra_fee_id')->references('id')->on('extra_fees');
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
