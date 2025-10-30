<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('heartbeats', function (Blueprint $table) {
            $table->id();
            $table->string('process_name')->index(); 
            $table->timestamp('last_heartbeat');
            $table->boolean('is_running')->default(true); 
            $table->text('additional_info')->nullable(); 
            $table->timestamps(); 
            
            $table->index(['process_name', 'is_running']);
            $table->index('last_heartbeat');
        });
        
        DB::table('heartbeats')->insert([
            'process_name' => 'machine_monitor',
            'last_heartbeat' => now(),
            'is_running' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heartbeats');
    }
};