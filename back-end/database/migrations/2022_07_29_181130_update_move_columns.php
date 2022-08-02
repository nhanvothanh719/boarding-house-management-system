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
            $table->dropForeign(['invoice_details_id']);
            $table->dropColumn('invoice_details_id');
            $table->dropForeign(['extra_fee_id']);
            $table->dropColumn('extra_fee_id');
            $table->float('total')->default(0)->change();
        });
        Schema::table('invoice_details', function (Blueprint $table) {
            $table->bigInteger('invoice_id')->unsigned()->after('id');
            $table->foreign('invoice_id')->references('id')->on('invoices');
        });
        Schema::table('extra_fees', function (Blueprint $table) {
            $table->bigInteger('invoice_id')->unsigned()->after('id');
            $table->foreign('invoice_id')->references('id')->on('invoices');
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
