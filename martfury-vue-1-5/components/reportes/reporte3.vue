<template>
    <div class="productos-vendidos-mes">
      <h1>Productos Más Vendidos por Mes</h1>
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
      <div v-else-if="productos.length === 0" class="no-data-container">
        <p>No se encontraron datos de productos vendidos.</p>
      </div>
      <div v-else>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mes</th>
              <th>Producto</th>
              <th>Cantidad Vendida</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ producto.Mes }}</td>
              <td>{{ producto.NombreProducto }}</td>
              <td>{{ producto.TotalVendido }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Reporte3",
    data() {
      return {
        productos: [],
        isLoading: true,
      };
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/reporte/productos-mas-vendidos-mes");
          if (response.data && Array.isArray(response.data)) {
            this.productos = response.data;
          } else {
            console.warn("La respuesta no contiene datos válidos:", response.data);
          }
        } catch (error) {
          console.error("Error al cargar el reporte de productos más vendidos por mes:", error);
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
  .productos-vendidos-mes {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 3.5rem;
    color: #333; /* Color negro para el título */
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 0;
  }
  
  .loading-container, .no-data-container {
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  }
  </style>
  