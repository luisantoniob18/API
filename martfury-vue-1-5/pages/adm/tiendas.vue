<template>
  <div>
    <Header />
    <div class="container">
      <h1 class="title">Gestión de Tiendas</h1>
      <button class="btn add-btn" @click="openModal('add')">Agregar Tienda</button>
      <div class="table-container">
        <table class="tienda-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tienda in tiendas" :key="tienda.IdTienda">
              <td>{{ tienda.Nombre }}</td>
              <td>{{ tienda.Direccion }}</td>
              <td>{{ tienda.Latitud }}</td>
              <td>{{ tienda.Longitud }}</td>
              <td>
                <button class="btn edit-btn" @click="openModal('edit', tienda)">Editar</button>
                <button class="btn delete-btn" @click="openDeleteModal(tienda.IdTienda)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de confirmación de eliminación -->
      <div v-if="deleteModalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeDeleteModal" class="close">&times;</span>
          <h2 class="modal-title">Confirmar Eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar esta tienda?</p>
          <button class="btn delete-confirm-btn" @click="confirmDelete">Eliminar</button>
          <button class="btn cancel-btn" @click="closeDeleteModal">Cancelar</button>
        </div>
      </div>

      <!-- Modal de creación/edición -->
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close">&times;</span>
          <h2 class="modal-title">{{ isEdit ? 'Actualizar Tienda' : 'Agregar Tienda' }}</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" v-model="form.nombre" required />
            </div>
            <div class="form-group">
              <label for="direccion">Dirección:</label>
              <input type="text" v-model="form.direccion" required />
            </div>
            <div class="form-group">
              <label for="latitud">Latitud:</label>
              <input type="number" step="any" v-model="form.latitud" required />
            </div>
            <div class="form-group">
              <label for="longitud">Longitud:</label>
              <input type="number" step="any" v-model="form.longitud" required />
            </div>
            <button class="btn submit-btn" type="submit">{{ isEdit ? 'Actualizar' : 'Agregar' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header2';

export default {
  components: {
    Header,
  },
  data() {
    return {
      apiUrl: 'http://137.184.244.147/api/tienda',
      tiendas: [],
      modalOpen: false,
      deleteModalOpen: false,
      isEdit: false,
      form: {
        idTienda: null,
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
      },
      tiendaAEliminar: null,
    };
  },
  methods: {
    async fetchTiendas() {
      try {
        const response = await axios.get(this.apiUrl);
        this.tiendas = response.data;
      } catch (error) {
        console.error('Error al obtener las tiendas:', error);
      }
    },
    openModal(action, tienda = null) {
      this.modalOpen = true;
      this.isEdit = action === 'edit';
      if (tienda) {
        this.form = {
          idTienda: tienda.IdTienda,
          nombre: tienda.Nombre,
          direccion: tienda.Direccion,
          latitud: tienda.Latitud,
          longitud: tienda.Longitud,
        };
      } else {
        this.resetForm();
      }
    },
    closeModal() {
      this.modalOpen = false;
      this.resetForm();
    },
    openDeleteModal(id) {
      this.deleteModalOpen = true;
      this.tiendaAEliminar = id;
    },
    closeDeleteModal() {
      this.deleteModalOpen = false;
      this.tiendaAEliminar = null;
    },
    async confirmDelete() {
      try {
        await axios.delete(`${this.apiUrl}/${this.tiendaAEliminar}`);
        this.fetchTiendas();
      } catch (error) {
        console.error('Error al eliminar la tienda:', error);
      } finally {
        this.closeDeleteModal();
      }
    },
    resetForm() {
      this.form = {
        idTienda: null,
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
      };
    },
    async submitForm() {
      const payload = {
        nombre: this.form.nombre,
        direccion: this.form.direccion,
        latitud: this.form.latitud,
        longitud: this.form.longitud,
      };

      try {
        if (this.isEdit) {
          await axios.put(`${this.apiUrl}/${this.form.idTienda}`, payload);
        } else {
          await axios.post(this.apiUrl, payload);
        }
        this.closeModal();
        this.fetchTiendas();
      } catch (error) {
        console.error('Error al guardar la tienda:', error);
      }
    },
  },
  mounted() {
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
.edit-btn {
  background-color: #2196F3;
  color: white;
}
.edit-btn:hover {
  background-color: #1976D2;
}
.delete-btn {
  background-color: #f44336;
  color: white;
}
.delete-btn:hover {
  background-color: #d32f2f;
}
.tienda-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.tienda-table th,
.tienda-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.tienda-table th {
  background-color: #f2f2f2;
  color: #333;
}
.table-container {
  overflow-x: auto; /* Responsividad para tablas */
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
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.submit-btn {
  background-color: #2196F3;
  color: white;
}
.submit-btn:hover {
  background-color: #1976D2;
}
.delete-confirm-btn {
  background-color: #f44336;
  color: white;
}
.delete-confirm-btn:hover {
  background-color: #d32f2f;
}
.cancel-btn {
  background-color: #aaa;
  color: white;
}
.cancel-btn:hover {
  background-color: #888;
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
  .tienda-table th,
  .tienda-table td {
    font-size: 12px;
  }
}
@media (max-width: 576px) {
  .btn {
    padding: 8px 10px;
    font-size: 12px;
  }
  .tienda-table th,
  .tienda-table td {
    padding: 6px;
  }
  .modal-content {
    margin: 10% auto;
    padding: 15px;
  }
}
</style>
