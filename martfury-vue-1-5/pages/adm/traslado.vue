<template>
  <div>
    <Header2 />

    <div class="container">
      <h1 class="title">Traslado de Productos entre Tiendas</h1>
      <button class="btn add-btn" @click="openModal">Realizar Traslado</button>

      <!-- Modal de traslado -->
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close">&times;</span>
          <h2 class="modal-title">Trasladar Producto</h2>
          <form @submit.prevent="submitTransfer">
            <div class="form-group">
              <label for="producto">Producto:</label>
              <select v-model="form.IdProducto" required>
                <option v-for="producto in productos" :key="producto.IdProducto" :value="producto.IdProducto">
                  {{ producto.Nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="tiendaOrigen">Tienda Origen:</label>
              <select v-model="form.IdTiendaOrigen" required>
                <option v-for="tienda in tiendas" :key="tienda.IdTienda" :value="tienda.IdTienda">
                  {{ tienda.Nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="tiendaDestino">Tienda Destino:</label>
              <select v-model="form.IdTiendaDestino" required>
                <option v-for="tienda in tiendas" :key="tienda.IdTienda" :value="tienda.IdTienda" :disabled="tienda.IdTienda === form.IdTiendaOrigen">
                  {{ tienda.Nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="cantidad">Cantidad:</label>
              <input type="number" v-model="form.Cantidad" min="1" required />
            </div>

            <button class="btn submit-btn" type="submit">Confirmar Traslado</button>
            <button class="btn cancel-btn" @click="closeModal">Cancelar</button>
          </form>
        </div>
      </div>

      <!-- Modal de confirmación de éxito -->
      <div v-if="successMessage" class="modal">
        <div class="modal-content">
          <span @click="closeSuccessModal" class="close">&times;</span>
          <h2 class="modal-title">Traslado Exitoso</h2>
          <p>{{ successMessage }}</p>
          <button class="btn cancel-btn" @click="closeSuccessModal">Cerrar</button>
        </div>
      </div>

      <!-- Modal de confirmación de error -->
      <div v-if="errorMessage" class="modal">
        <div class="modal-content">
          <span @click="closeErrorModal" class="close">&times;</span>
          <h2 class="modal-title">Error</h2>
          <p>{{ errorMessage }}</p>
          <button class="btn cancel-btn" @click="closeErrorModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header2 from '@/components/Header2';

export default {
  components: {
    Header2,
  },
  data() {
    return {
      apiUrl: 'http://137.184.244.147/api/traslado',
      productosUrl: 'http://137.184.244.147/api/producto',
      tiendasUrl: 'http://137.184.244.147/api/tienda',
      productos: [],
      tiendas: [],
      modalOpen: false,
      errorMessage: null,
      successMessage: null,
      form: {
        IdProducto: null,
        IdTiendaOrigen: null,
        IdTiendaDestino: null,
        Cantidad: 1,
      },
    };
  },
  methods: {
    async fetchProductos() {
      try {
        const response = await axios.get(this.productosUrl);
        this.productos = response.data;
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    },
    async fetchTiendas() {
      try {
        const response = await axios.get(this.tiendasUrl);
        this.tiendas = response.data;
      } catch (error) {
        console.error('Error al obtener las tiendas:', error);
      }
    },
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.resetForm();
    },
    closeSuccessModal() {
      this.successMessage = null;
    },
    closeErrorModal() {
      this.errorMessage = null;
    },
    resetForm() {
      this.form = {
        IdProducto: null,
        IdTiendaOrigen: null,
        IdTiendaDestino: null,
        Cantidad: 1,
      };
    },
    async submitTransfer() {
      try {
        const response = await axios.post(this.apiUrl, this.form);
        this.successMessage = response.data.mensaje; // Mostrar mensaje de éxito en el modal
        this.closeModal();
      } catch (error) {
        if (error.response && error.response.data.error) {
          this.errorMessage = error.response.data.error;
        } else {
          console.error('Error al realizar el traslado:', error);
          this.errorMessage = 'Error al realizar el traslado.';
        }
      }
    },
  },
  beforeCreate() {
    const authCookie = this.$cookies.get('auth');
    if (!authCookie || !authCookie.isLoggedIn || authCookie.IdRol !== 1) {
      this.$router.push('/');
    }
  },
  mounted() {
    this.fetchProductos();
    this.fetchTiendas();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.title {
  text-align: center;
  font-size: 24px;
  color: #333;
}
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s, color 0.3s;
}
.add-btn {
  background-color: #4CAF50;
  color: white;
}
.add-btn:hover {
  background-color: #45a049;
}
.submit-btn {
  background-color: #2196F3;
  color: white;
}
.submit-btn:hover {
  background-color: #1976D2;
}
.cancel-btn {
  background-color: #aaa;
  color: white;
}
.cancel-btn:hover {
  background-color: #888;
}
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.modal-title {
  text-align: center;
  color: #333;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group select,
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  .title {
    font-size: 20px;
  }
  .btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  .form-group select,
  .form-group input {
    font-size: 14px;
  }
  .modal-content {
    width: 95%;
  }
}
@media (max-width: 576px) {
  .btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .form-group select,
  .form-group input {
    font-size: 12px;
  }
  .modal-content {
    margin: 20% auto;
    padding: 15px;
  }
}
</style>
