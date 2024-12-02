<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // Asegúrate de importar esta clase
use Illuminate\Database\Eloquent\Model;

class Cliente extends Authenticatable // Cambia de Model a Authenticatable
{
    use HasFactory;

    protected $table = 'clientes';

    protected $primaryKey = 'IdCliente'; // Si tienes una columna primaria diferente, defínela aquí
    public $timestamps = false;
    protected $fillable = [
        'Nombre',
        'Apellido',
        'Correo',
        'Contraseña',
        'NIT',
        'IdRol',
    ];

    

    // Relación con el modelo Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'IdRol');
    }

    // Método necesario para que Laravel use el campo correcto como contraseña
    public function getAuthPassword()
    {
        return $this->Contraseña; // Retorna la columna `Contraseña` en lugar de `password`
    }
}
