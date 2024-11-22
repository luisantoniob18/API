<template>
  <div class="productos-bajo-stock">
    <h1>Productos con Bajo Stock</h1>
    <div class="button-container">
      <button
        @click="downloadAsPng"
        class="download-icon-btn"
        title="Descargar como PNG"
      >
        ⬇️
      </button>
    </div>
    <div ref="tableContainer" class="table-container">
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
      <div v-else-if="productos.length === 0" class="no-data-container">
        <p>No se encontraron productos con bajo stock.</p>
      </div>
      <div v-else>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Tienda</th>
              <th>Cantidad Disponible</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ producto.NombreProducto }}</td>
              <td>{{ producto.NombreTienda }}</td>
              <td>{{ producto.Existencia }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2canvas from "html2canvas";

export default {
  name: "Reporte2",
  data() {
    return {
      productos: [],
      isLoading: true,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/reporte/productos-bajo-stock"
        );
        if (response.data && Array.isArray(response.data)) {
          this.productos = response.data;
        } else {
          console.warn("La respuesta no contiene datos válidos:", response.data);
        }
      } catch (error) {
        console.error(
          "Error al cargar el reporte de productos con bajo stock:",
          error
        );
      } finally {
        this.isLoading = false;
      }
    },
    async downloadAsPng() {
      const tableContainer = this.$refs.tableContainer; // Referencia al contenedor de la tabla
      if (!tableContainer) return;

      try {
        const canvas = await html2canvas(tableContainer, {
          useCORS: true, // Permite cargar estilos externos como fuentes
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png"); // Genera la imagen en formato PNG
        link.download = "productos_bajo_stock.png"; // Nombre del archivo descargado
        link.click();
      } catch (error) {
        console.error("Error al generar la imagen PNG:", error);
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.productos-bajo-stock {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  position: relative; /* Para permitir la posición del botón */
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 3.5rem;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 0;
}

.button-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

.download-icon-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #f0c004; /* Color dorado */
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
}

.download-icon-btn:hover {
  transform: scale(1.2); /* Efecto de aumento al pasar el cursor */
  color: #d4a602; /* Color dorado más oscuro */
}

.loading-container,
.no-data-container {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.table-container {
  margin-top: 50px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.report-table th,
.report-table td {
  padding: 20px;
  text-align: left;
  font-size: 1.2rem;
}

.report-table th {
  background-color: #f4f6f8;
  color: #555;
  font-weight: 600;
  text-transform: uppercase;
}

.report-table tbody tr {
  transition: all 0.3s ease;
}

.report-table tbody tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.report-table td {
  border-bottom: 1px solid #ddd;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .report-table th,
  .report-table td {
    padding: 15px;
    font-size: 1.1rem;
  }

  h1 {
    font-size: 2.2rem;
  }

  .button-container {
    top: 10px;
    right: 10px;
  }
}
</style>
