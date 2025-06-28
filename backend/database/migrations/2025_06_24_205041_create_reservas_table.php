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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();

            // Cliente
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Proveedor (nullable por si aún no está asignado)
            $table->foreignId('proveedor_id')->nullable()->constrained('users')->onDelete('set null');

            $table->string('evento');
            $table->date('fecha');
            $table->string('estado')->default('pendiente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
