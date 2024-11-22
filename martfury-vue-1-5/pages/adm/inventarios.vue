<template>
  <div class="container">
    <h1 class="title">Seleccione una tienda</h1>
    <div class="select-container">
      <select v-model="tiendaSeleccionada" class="select-tienda">
        <option v-for="tienda in tiendas" :key="tienda.IdTienda" :value="tienda.IdTienda">
          {{ tienda.Nombre }}
        </option>
      </select>
    </div>
    
    <div class="table-container">
      <table v-if="productos.length > 0" class="table-productos">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Descripcion</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.IdProducto">
            <td>{{ producto.producto.Nombre }}</td>
            <td>{{ producto.producto.Descripcion }}</td>
            <td>{{ producto.Cantidad }}</td>
            <td>{{ producto.producto.Precio }}</td>
            <td>
              <button class="editar" @click="editarProducto(producto)">Editar</button>
              <button class="eliminar" @click="eliminarProducto(producto.IdInventario)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-products">No hay productos en la tienda seleccionada</p>
    </div>

    <!-- Botón para abrir el modal de agregar productos -->
    <button v-if="tiendaSeleccionada" class="agregar" @click="abrirModalAgregar">Agregar Producto</button>

    <!-- Modal para agregar producto -->
    <div class="modal" :class="{ 'modal-abierto': modalAgregar }">
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Agregar Producto</h2>
          <button class="cerrar-modal" @click="modalAgregar = false">&times;</button>
        </div>
        <form @submit.prevent="agregarProducto">
          <div>
            <label>Producto:</label>
            <select v-model="productoSeleccionado" class="select-producto">
              <option v-for="producto in productosDisponibles" :key="producto.IdProducto" :value="producto.IdProducto">
                {{ producto.Nombre }}
              </option>
            </select>
          </div>
          <div>
            <label>Cantidad:</label>
            <input type="number" min="1" v-model="cantidadProducto" required>
          </div>
          <button class="cancelar" @click="modalAgregar = false">Cancelar</button>
          <button class="agregar" type="submit">Agregar</button>
        </form>
      </div>
    </div>

    <!-- Modal para actualizar -->
    <div class="modal" :class="{ 'modal-abierto': modalActualizar }">
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Actualizar cantidad</h2>
          <button class="cerrar-modal" @click="modalActualizar = false">&times;</button>
        </div>
        <form @submit.prevent="actualizarProducto">
          <div>
            <label>Cantidad:</label>
            <input type="number" min="1" v-model="productoActualizar.Cantidad" required>
          </div>
          <button class="cancelar" @click="modalActualizar = false">Cancelar</button>
          <button class="actualizar" type="submit">Actualizar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://137.184.244.147/api/api';

export default {
  data() {
    return {
      tiendas: [],
      tiendaSeleccionada: null,
      productos: [],
      modalActualizar: false,
      modalAgregar: false,
      productosDisponibles: [],
      productoSeleccionado: null,
      cantidadProducto: 1,
      productoActualizar: {},
    }
  },
  mounted() {
    this.getTiendas();
  },
  watch: {
    tiendaSeleccionada(newValue) {
      this.getProductos(newValue);
    }
  },
  methods: {
    getTiendas() {
      axios.get(`${API_URL}/tienda`)
        .then(response => {
          this.tiendas = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getProductos(idTienda) {
      axios.get(`${API_URL}/inventario/${idTienda}`)
        .then(response => {
          this.productos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    getProductosDisponibles() {
      axios.get(`${API_URL}/producto`)
        .then(response => {
          this.productosDisponibles = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    abrirModalAgregar() {
      this.modalAgregar = true;
      this.getProductosDisponibles(); // Carga los productos disponibles al abrir el modal
      this.productoSeleccionado = null;
      this.cantidadProducto = 1;
    },
    agregarProducto() {
      axios.post(`${API_URL}/inventario`, {
        IdTienda: this.tiendaSeleccionada,
        IdProducto: this.productoSeleccionado,
        Cantidad: this.cantidadProducto,
      })
        .then(response => {
          this.modalAgregar = false;
          this.getProductos(this.tiendaSeleccionada); // Actualiza la lista de productos
        })
        .catch(error => {
          console.error(error);
        });
    },
    editarProducto(producto) {
      this.modalActualizar = true;
      this.productoActualizar = { ...producto }; // Clonamos el objeto para evitar mutaciones
    },
    actualizarProducto() {
      axios.put(`${API_URL}/inventario/${this.productoActualizar.IdInventario}`, {
        Cantidad: this.productoActualizar.Cantidad,
      })
        .then(response => {
          this.modalActualizar = false;
          this.getProductos(this.tiendaSeleccionada);
        })
        .catch(error => {
          console.error(error);
        });
    },
    eliminarProducto(idInventario) {
      axios.delete(`${API_URL}/inventario/${idInventario}`)
        .then(response => {
          this.getProductos(this.tiendaSeleccionada);
        })
        .catch(error => {
          console.error(error);
        });
    },
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.select-container {
  margin-bottom: 20px;
}

.select-tienda, .select-producto {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.table-container {
  overflow-x: auto;
}

.table-productos {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

.no-products {
  text-align: center;
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
}

.modal-abierto {
  display: block;
}

.modal-contenido {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button.editar {
  background-color: #4CAF50;
  color: #fff;
}

button.editar:hover {
  background-color: #3e8e41;
}

button.eliminar {
  background-color: #f44336;
  color: #fff;
}

button.eliminar:hover {
  background-color: #e33935;
}

button.actualizar {
  background-color: #03A9F4;
  color: #fff;
}

button.actualizar:hover {
  background-color: #039BE5;
}

button.cancelar {
  background-color: #ccc;
  color: #333;
}

button.cancelar:hover {
  background-color: #aaa;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cerrar-modal {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.cerrar-modal:hover {
  color: #f44336;
}

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.select-container {
  margin-bottom: 20px;
}

.select-tienda, .select-producto {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.table-container {
  overflow-x: auto;
}

.table-productos {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

.no-products {
  text-align: center;
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center; /* Centrar verticalmente */
  justify-content: center; /* Centrar horizontalmente */
}

.modal-abierto {
  display: flex; /* Cambiado a flex para centrar el modal */
}

.modal-contenido {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 400px; /* Ancho fijo para el modal */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-header .cerrar-modal {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-header .cerrar-modal:hover {
  color: #f44336;
}

form {
  display: flex;
  flex-direction: column; /* Organizar elementos en columna */
}

label {
  margin-top: 10px; /* Espaciado superior para etiquetas */
  font-weight: bold; /* Resaltar etiquetas */
}

input[type="number"], .select-producto {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px; /* Espaciado superior para inputs */
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 15px; /* Espaciado superior para botones */
}

button.agregar {
  background-color: #4CAF50;
  color: #fff;
}

button.agregar:hover {
  background-color: #45a049;
}

button.cancelar {
  background-color: #f44336;
  color: #fff;
}

button.cancelar:hover {
  background-color: #e53935;
}

button.actualizar {
  background-color: #03A9F4;
  color: #fff;
}

button.actualizar:hover {
  background-color: #039BE5;
}

</style>