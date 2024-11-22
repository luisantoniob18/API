<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cotizacion;
use App\Models\DetalleCotizacion;
use App\Models\Inventario;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class CotizacionController extends Controller
{
   
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Crear la cotización
            $cotizacion = Cotizacion::create([
                'IdCliente' => $request->IdCliente,
                'Fecha' => now(),
                'Total' => $request->amount,
                'Destino' => $request->address
            ]);

            // Procesar cada producto en la cotización
            $total = 0;
            foreach ($request->items as $item) {
                // Obtener el inventario del producto (sin descontarlo)
                $inventario = Inventario::where('IdProducto', $item['id'])->first();

                if (!$inventario) {
                    throw new \Exception("Producto no encontrado para el ID: {$item['id']}");
                }

                // Crear el detalle de la cotización
                DetalleCotizacion::create([
                    'IdCotizacion' => $cotizacion->IdCotizacion,
                    'Cantidad' => $item['quantity'],
                    'Precio' => $inventario->producto->Precio, // Precio del producto
                    'IdInventario' => $inventario->IdInventario,
                ]);

                // Calcular el total de la cotización
                $total += $item['quantity'] * $inventario->producto->Precio;
            }

            // Actualizar el total de la cotización
            $cotizacion->Total = $total;
            $cotizacion->save();

            DB::commit();

            // Generar el PDF del recibo de cotización
            $pdf = $this->generarRecibo($cotizacion);
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="Recibo_Cotizacion_' . $cotizacion->IdCotizacion . '.pdf"');

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

   
    private function generarRecibo($cotizacion)
    {
        // Obtener los detalles de la cotización
        $detallesCotizacion = DetalleCotizacion::where('IdCotizacion', $cotizacion->IdCotizacion)
            ->with('inventario.producto')
            ->get();
        
        $cliente = $cotizacion->cliente;

        // Preparar los datos para el recibo de cotización
        $datos = [
            'cotizacion' => $cotizacion,
            'detalles' => $detallesCotizacion,
            'fecha' => now()->format('d/m/Y'),
            'hora' => now()->format('H:i:s'),
            'cliente' => [
                'nombre' => $cliente->Nombre,
                'apellido' => $cliente->Apellido,
                'nit' => $cliente->NIT ?: 'CF',
            ],
        ];

        // Generar el PDF para el recibo de cotización
        return Pdf::loadView('recibo_cotizacion', $datos);
    }
}
