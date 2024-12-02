<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Inventario;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Crear la venta
            $venta = Venta::create([
                'IdCliente' => $request->IdCliente,
                'Fecha' => now(),
                'Total' => $request->amount,
                'Destino' => $request->address
            ]);

            // Procesar cada producto en el carrito
            foreach ($request->items as $item) {
                $inventario = Inventario::where('IdProducto', $item['id'])
                    ->where('Cantidad', '>=', $item['quantity'])
                    ->first();

                if (!$inventario) {
                    throw new \Exception("No hay suficiente inventario para el producto ID: {$item['id']}");
                }

                // Crear el detalle de la venta
                DetalleVenta::create([
                    'IdVenta' => $venta->IdVenta,
                    'Cantidad' => $item['quantity'],
                    'IdInventario' => $inventario->IdInventario,
                    'Precio' => $inventario->producto->Precio,
                ]);

                // Reducir la cantidad en el inventario
                $inventario->Cantidad -= $item['quantity'];
                $inventario->save();
            }

            DB::commit();

            // Generar el PDF de la factura y devolverlo en la respuesta
            $pdf = $this->generarFactura($venta);
            return response($pdf->output(), 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="Factura_' . $venta->IdVenta . '.pdf"');

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    private function generarFactura($venta)
    {
        $detallesVenta = DetalleVenta::where('IdVenta', $venta->IdVenta)
            ->with('inventario.producto')
            ->get();
        
        $cliente = $venta->cliente;

        // Preparar los datos para la factura
        $datos = [
            'venta' => $venta,
            'detalles' => $detallesVenta,
            'fecha' => now()->format('d/m/Y'),
            'hora' => now()->format('H:i:s'),
            'cliente' => [
                'nombre' => $cliente->Nombre,
                'apellido' => $cliente->Apellido,
                'nit' => $cliente->NIT ?: 'CF',
            ],
        ];

        // Generar el PDF de la factura
        return Pdf::loadView('factura', $datos);
    }
}
