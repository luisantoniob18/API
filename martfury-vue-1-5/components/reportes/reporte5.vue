<template>
    <div class="compras-rango-fecha">
      <h1>Compras por Rango de Fecha</h1>
      <form>
        <div class="form-group">
          <label for="start_date">Fecha de Inicio:</label>
          <input type="date" v-model="startDate" @change="checkAndFetchData" required class="date-input" />
        </div>
        <div class="form-group">
          <label for="end_date">Fecha de Fin:</label>
          <input type="date" v-model="endDate" @change="checkAndFetchData" required class="date-input" />
        </div>
      </form>
  
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
      <div v-else-if="compras.length === 0" class="no-data-container">
        <p>No se encontraron datos en el rango de fechas seleccionado.</p>
      </div>
      <div v-else>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha de Compra</th>
              <th>Cliente</th>
              <th>Detalle de Productos</th>
              <th>Total Gastado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(compra, index) in compras" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDate(compra.FechaCompra) }}</td>
              <td>{{ compra.NombreCliente }} {{ compra.ApellidoCliente }}</td>
              <td>{{ compra.DetalleProductos }}</td>
              <td>{{ formatCurrency(compra.TotalGastado) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Reporte5",
    data() {
      return {
        startDate: "", // Fecha de inicio
        endDate: "", // Fecha de fin
        compras: [], // Datos de compras por rango de fecha
        isLoading: false, // Control de carga
      };
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/reporte/compras-por-rango-fecha",
            {
              start_date: this.startDate,
              end_date: this.endDate,
            }
          );
  
          if (response.data && Array.isArray(response.data)) {
            this.compras = response.data;
          } else {
            console.warn("La respuesta no contiene datos válidos:", response.data);
          }
        } catch (error) {
          console.error("Error al cargar el reporte de compras por rango de fecha:", error);
        } finally {
          this.isLoading = false;
        }
      },
      checkAndFetchData() {
        if (this.startDate && this.endDate) {
          this.fetchData();
        }
      },
      formatDate(date) {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(date).toLocaleDateString("es-GT", options);
      },
      formatCurrency(value) {
        const formatter = new Intl.NumberFormat("es-GT", {
          style: "currency",
          currency: "GTQ",
        });
        return formatter.format(value);
      },
    },
  };
  </script>
  
  <style scoped>
  .compras-rango-fecha {
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
    color: #333;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 0;
  }
  
  form {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .date-input {
    padding: 10px;
    border: 2px solid #ddd; /* Marco definido */
    border-radius: 5px;
    font-size: 1rem;
    outline: none;
    width: 180px;
    transition: all 0.3s ease;
  }
  
  .date-input:focus {
    border-color: #3498db; /* Color de borde en foco */
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
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
    width: 90%;
    margin: 0 auto;
    border-collapse: collapse;
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
  