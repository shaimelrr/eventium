<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Models\Reserva;

// Registro y login con JWT
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Ruta protegida con token
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);

// Cliente: obtener sus reservas
Route::middleware('auth:api')->get('/cliente/reservas', function () {
    return auth()->user()->reservas;
});

// Cliente: crear una nueva reserva
Route::middleware('auth:api')->post('/cliente/reservas', function (Request $request) {
    return $request->user()->reservas()->create($request->only('evento', 'fecha'));
});

// Cliente: cancelar una reserva pendiente
Route::middleware('auth:api')->delete('/cliente/reservas/{id}', function ($id) {
    $reserva = auth()->user()->reservas()->findOrFail($id);

    if ($reserva->estado === 'pendiente') {
        $reserva->delete();
        return response()->json(['message' => 'Reserva cancelada'], 200);
    }

    return response()->json(['message' => 'Solo se pueden eliminar reservas pendientes'], 403);
});

// Proveedor: obtener solo sus reservas asignadas
Route::middleware('auth:api')->get('/proveedor/reservas', function () {
    return auth()->user()->reservasAsignadas()
        ->with('cliente')  // incluir info del cliente
        ->latest()
        ->paginate(10);   // paginación
});

// Proveedor: actualizar estado de reserva
Route::middleware('auth:api')->put('/proveedor/reservas/{id}', function ($id, Request $request) {
    $reserva = Reserva::findOrFail($id);
    $reserva->estado = $request->estado;
    $reserva->save();

    return response()->json(['message' => 'Estado actualizado']);
});
// Admin: obtener todos los usuarios
Route::middleware('auth:api')->get('/admin/usuarios', function () {
    return App\Models\User::orderBy('created_at', 'desc')->get();
});

// Admin: cambiar el rol de un usuario
Route::middleware('auth:api')->put('/admin/usuarios/{id}/rol', function ($id, \Illuminate\Http\Request $request) {
    $user = App\Models\User::findOrFail($id);
    $user->role = $request->role;
    $user->save();
    return response()->json(['message' => 'Rol actualizado']);
});

// Admin: ver todas las reservas
Route::middleware('auth:api')->get('/admin/reservas', function () {
    return App\Models\Reserva::with(['cliente', 'proveedor'])->latest()->paginate(10);
});

