<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('machine_defs', function (Blueprint $table) {
            $table->bigInteger('run_hour')->default(0)->comment('Total run time in seconds');
            $table->timestamp('last_status_change')->nullable()->comment('Last time status changed');
            $table->boolean('last_running_status')->default(false)->comment('Last running status');
            $table->timestamp('last_runhour_update')->nullable()->comment('Last runhour calculation time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machine_defs', function (Blueprint $table) {
            $table->dropColumn(['run_hour', 'last_status_change', 'last_running_status', 'last_runhour_update']);
        });
    }
};