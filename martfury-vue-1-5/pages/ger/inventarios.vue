<template>
  <div class="container">
    <Header />
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
              <button class="eliminar" @click="openDeleteModal(producto.IdInventario)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-products">No hay productos en la tienda seleccionada</p>
    </div>

    <button v-if="tiendaSeleccionada" class="agregar" @click="abrirModalAgregar">Agregar Producto</button>

    <!-- Modal para agregar producto -->
    <div class="modal" :class="{ 'modal-abierto': modalAgregar }">
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Agregar Producto</h2>
          <button class="cerrar-modal" @click="modalAgregar = false">&times;</button>
        </div>
        <form @submit.prevent="submitAgregarProducto">
          <div>
            <label>Producto:</label>
            <select v-model="productoSeleccionado" class="select-producto" required>
              <option v-for="producto in productosDisponibles" :key="producto.IdProducto" :value="producto.IdProducto">
                {{ producto.Nombre }}
              </option>
            </select>
          </div>
          <div>
            <label>Cantidad:</label>
            <input type="number" min="1" v-model="cantidadProducto" required>
          </div>
          <div class="modal-buttons">
            <button type="button" class="cancelar" @click="closeAgregarModal">Cancelar</button>
            <button type="submit" class="agregar">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para actualizar cantidad -->
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
          <div class="modal-buttons">
            <button type="button" class="cancelar" @click="modalActualizar = false">Cancelar</button>
            <button class="actualizar" type="submit">Actualizar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div class="modal" :class="{ 'modal-abierto': deleteModalOpen }">
      <div class="modal-contenido">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button class="cerrar-modal" @click="closeDeleteModal">&times;</button>
        </div>
        <p class="modal-message">¿Estás seguro de que deseas eliminar este producto?</p>
        <div class="modal-buttons">
          <button class="delete-confirm-btn" @click="confirmDelete">Eliminar</button>
          <button class="cancel-btn" @click="closeDeleteModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header';
const API_URL = 'http://137.184.244.147/api';

export default {
  components: {
    Header,
  },
  data() {
    return {
      tiendas: [],
      tiendaSeleccionada: null,
      productos: [],
      modalActualizar: false,
      modalAgregar: false,
      deleteModalOpen: false,
      productosDisponibles: [],
      productoSeleccionado: null,
      cantidadProducto: 1,
      productoActualizar: {},
      productoAEliminar: null,
    };
  },
  beforeCreate() {
    const authCookie = this.$cookies.get('auth');
    if (!authCookie || !authCookie.isLoggedIn || authCookie.IdRol !== 2) {
      this.$router.push('/');
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
      this.getProductosDisponibles();
      this.productoSeleccionado = null;
      this.cantidadProducto = 1;
    },
    submitAgregarProducto() {
  // Obtener los datos necesarios para construir el log
  const productoSeleccionado = this.productosDisponibles.find(
    producto => producto.IdProducto === this.productoSeleccionado
  );
  const nombreTienda = this.tiendas.find(t => t.IdTienda === this.tiendaSeleccionada).Nombre;
  const authCookie = this.$cookies.get('auth');
  const nombreUsuario = authCookie.nombre;

  // Construir la descripción del log con la cantidad
  const logDescripcion = `${nombreUsuario} agregó ${this.cantidadProducto} unidades del producto "${productoSeleccionado.Nombre}" al inventario de la tienda "${nombreTienda}" a las ${new Date().toLocaleTimeString()}`;

  // Enviar la solicitud al backend
  axios.post(`${API_URL}/inventario`, {
    IdTienda: this.tiendaSeleccionada,
    IdProducto: this.productoSeleccionado,
    Cantidad: this.cantidadProducto, // Cantidad agregada
    LogDescripcion: logDescripcion // Descripción del log
  })
    .then(() => {
      this.modalAgregar = false; // Cerrar el modal
      this.getProductos(this.tiendaSeleccionada); // Actualizar la lista de productos
    })
    .catch(error => {
      console.error(error);
    });
},
    closeAgregarModal() {
      this.modalAgregar = false;
      this.productoSeleccionado = null;
      this.cantidadProducto = 1;
    },
    editarProducto(producto) {
      this.modalActualizar = true;
      this.productoActualizar = { ...producto };
    },
    actualizarProducto() {
  // Obtener el producto a actualizar
  const productoActualizado = this.productos.find(
    producto => producto.IdInventario === this.productoActualizar.IdInventario
  );
  const nombreTienda = this.tiendas.find(t => t.IdTienda === this.tiendaSeleccionada).Nombre;
  const authCookie = this.$cookies.get('auth');
  const nombreUsuario = authCookie.nombre;

  // Guardar la cantidad anterior
  const cantidadAnterior = productoActualizado.Cantidad;

  // Construir la descripción del log
  const logDescripcion = `${nombreUsuario} actualizó la cantidad del producto "${productoActualizado.producto.Nombre}" en el inventario de la tienda "${nombreTienda}" de ${cantidadAnterior} a ${this.productoActualizar.Cantidad} unidades a las ${new Date().toLocaleTimeString()}`;

  // Enviar la solicitud al backend
  axios.put(`${API_URL}/inventario/${this.productoActualizar.IdInventario}`, {
    Cantidad: this.productoActualizar.Cantidad, // Nueva cantidad
    LogDescripcion: logDescripcion // Descripción del log
  })
    .then(() => {
      this.modalActualizar = false; // Cerrar el modal
      this.getProductos(this.tiendaSeleccionada); // Actualizar la lista de productos
    })
    .catch(error => {
      console.error(error);
    });
}
,
    openDeleteModal(idInventario) {
      this.deleteModalOpen = true;
      this.productoAEliminar = idInventario;
    },
    closeDeleteModal() {
      this.deleteModalOpen = false;
      this.productoAEliminar = null;
    },
    confirmDelete() {
  const productoEliminado = this.productos.find(producto => producto.IdInventario === this.productoAEliminar);
  const authCookie = this.$cookies.get('auth');
  const nombreUsuario = authCookie.nombre;
  const nombreTienda = this.tiendas.find(t => t.IdTienda === this.tiendaSeleccionada).Nombre;

  const logDescripcion = `${nombreUsuario} eliminó el producto "${productoEliminado.producto.Nombre}" del inventario de la tienda "${nombreTienda}" a las ${new Date().toLocaleTimeString()}`;

  axios.delete(`${API_URL}/inventario/${this.productoAEliminar}`, {
    data: {
      LogDescripcion: logDescripcion // Enviar el log al backend
    }
  })
    .then(() => {
      this.getProductos(this.tiendaSeleccionada);
    })
    .catch(error => {
      console.error(error.response.data);
    })
    .finally(() => {
      this.closeDeleteModal();
    });
}


,
  }
};
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
  background-color: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
}

.modal-abierto {
  display: flex;
}

.modal-contenido {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 400px;
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

.modal-message {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.delete-confirm-btn {
  background-color: #f44336;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-confirm-btn:hover {
  background-color: #d32f2f;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #aaa;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

input[type="number"], .select-producto {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 15px;
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
</style>
