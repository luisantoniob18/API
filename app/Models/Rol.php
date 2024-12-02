<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = 'rols';
    protected $primaryKey = 'IdRol'; 
    protected $fillable = [
        'Rol',
    ];

    public function clientes()
    {
        return $this->hasMany(Cliente::class, 'IdRol'); // Relación uno a muchos
    }
}
