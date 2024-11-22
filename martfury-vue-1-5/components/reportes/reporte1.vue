<template>
  <div class="top-productos">
    <h1>Top Productos Más Vendidos</h1>
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>
    <div v-else-if="chartSeries[0].data.length === 0">
      <p>No hay datos para mostrar en el reporte.</p>
    </div>
    <div v-else>
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
        class="chart-canvas"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isLoading: true,
      chartOptions: {
        chart: {
          id: "top-productos-chart",
        },
        xaxis: {
          categories: ["Sin datos"], // Valores predeterminados
        },
        colors: ["#f0c004"], // Color personalizado para las barras
        title: {
          align: "center",
        },
        tooltip: {
          enabled: true,
        },
      },
      chartSeries: [
        {
          name: "Cantidad Vendida",
          data: [0], // Valores predeterminados
        },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/reporte/top-productos"
        );

        if (response.data && Array.isArray(response.data.mas_vendidos_general)) {
          const productos = response.data.mas_vendidos_general;

          if (productos.length > 0) {
            this.chartOptions.xaxis.categories = productos.map(
              (producto) => producto.NombreProducto
            );
            this.chartSeries = [
              {
                name: "Cantidad Vendida",
                data: productos.map((producto) => producto.TotalVendido),
              },
            ];
          } else {
            this.chartOptions.xaxis.categories = ["Sin datos"];
            this.chartSeries = [{ name: "Cantidad Vendida", data: [0] }];
          }
        } else {
          console.error("La respuesta no contiene datos válidos:", response.data);
        }
      } catch (error) {
        console.error("Error al cargar el reporte:", error);
        this.chartOptions.xaxis.categories = ["Error"];
        this.chartSeries = [{ name: "Cantidad Vendida", data: [0] }];
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.top-productos {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
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

.loading-container {
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

.chart-canvas {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }
}
</style>
