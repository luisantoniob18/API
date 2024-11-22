<template>
    <div class="productos-mas-vendidos">
      <h1>Productos Más Vendidos por Tienda</h1>
      <div class="form-group">
        <label for="select-tienda">Selecciona una Tienda:</label>
        <select
          id="select-tienda"
          v-model="tiendaSeleccionada"
          @change="fetchReporte"
          class="dropdown"
        >
          <option v-for="tienda in tiendas" :key="tienda.IdTienda" :value="tienda.Nombre">
            {{ tienda.Nombre }}
          </option>
        </select>
      </div>
  
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando reporte...</p>
      </div>
  
      <div v-else-if="productos.length === 0 && tiendaSeleccionada" class="no-data-container">
        <p>No se encontraron productos vendidos para esta tienda.</p>
      </div>
  
      <div v-else>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Total Vendido</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="index">
              <td>{{ index + 1 }}</td>
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
    name: "Reporte7",
    data() {
      return {
        tiendas: [], // Lista de tiendas obtenidas del backend
        tiendaSeleccionada: "", // Tienda seleccionada por el usuario
        productos: [], // Productos más vendidos de la tienda seleccionada
        isLoading: false, // Estado de carga del reporte
      };
    },
    methods: {
      // Obtener todas las tiendas desde el backend
      async fetchTiendas() {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/tienda");
          this.tiendas = response.data;
        } catch (error) {
          console.error("Error al cargar las tiendas:", error);
        }
      },
  
      // Obtener los productos más vendidos de la tienda seleccionada
      async fetchReporte() {
        if (!this.tiendaSeleccionada) return; // Validar que haya una tienda seleccionada
  
        this.isLoading = true;
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/reporte/toptienda",
            { nombre_tienda: this.tiendaSeleccionada }
          );
          this.productos = response.data;
        } catch (error) {
          console.error("Error al cargar el reporte:", error);
        } finally {
          this.isLoading = false;
        }
      },
    },
    mounted() {
      this.fetchTiendas(); // Cargar las tiendas al montar el componente
    },
  };
  </script>
  
  <style scoped>
  .productos-mas-vendidos {
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
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .form-group {
    margin-bottom: 20px;
    text-align: center;
  }
  
  label {
    font-size: 1.2rem;
    font-weight: 600;
    margin-right: 10px;
  }
  
  .dropdown {
    padding: 10px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: all 0.3s ease;
  }
  
  .dropdown:focus {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
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
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
  