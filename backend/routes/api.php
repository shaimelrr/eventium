<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Registro y login con JWT
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Ruta protegida con token
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);
