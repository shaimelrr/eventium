<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $fillable = [
        'evento',
        'fecha',
        'estado',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function proveedor()
    {
    return $this->belongsTo(User::class, 'proveedor_id');
    }

    public function cliente()
    {
    return $this->belongsTo(User::class, 'user_id');
    }

}
