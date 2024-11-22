<template>
  <div>
    <Header />

    <div class="container">
      <h1 class="title">Gestión de Clientes</h1>
      <button class="btn add-btn" @click="openModal('add')">Agregar Cliente</button>
      <div class="table-container">
        <table class="client-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>NIT</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientes" :key="cliente.IdCliente">
              <td>{{ cliente.Nombre }}</td>
              <td>{{ cliente.Apellido }}</td>
              <td>{{ cliente.Correo }}</td>
              <td>{{ cliente.NIT }}</td>
              <td>{{ cliente.rol ? cliente.rol.Rol : 'Cliente' }}</td>
              <td>
                <button class="btn edit-btn" @click="openModal('edit', cliente)">Editar</button>
                <button class="btn delete-btn" @click="openDeleteModal(cliente.IdCliente)">Eliminar</button>
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
          <p>¿Estás seguro de que deseas eliminar este cliente?</p>
          <button class="btn delete-confirm-btn" @click="confirmDelete">Eliminar</button>
          <button class="btn cancel-btn" @click="closeDeleteModal">Cancelar</button>
        </div>
      </div>

      <!-- Modal de creación/edición -->
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close">&times;</span>
          <h2 class="modal-title">{{ isEdit ? 'Actualizar Cliente' : 'Agregar Cliente' }}</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" v-model="form.Nombre" required />
            </div>

            <div class="form-group">
              <label for="apellido">Apellido:</label>
              <input type="text" v-model="form.Apellido" required />
            </div>

            <div class="form-group">
              <label for="correo">Correo:</label>
              <input type="email" v-model="form.Correo" required />
            </div>

            <div class="form-group">
              <label for="nit">NIT:</label>
              <input type="text" v-model="form.NIT" />
            </div>

            <div class="form-group">
              <label for="contraseña">Contraseña:</label>
              <input type="password" v-model="form.Contraseña" :required="!isEdit" />
            </div>

            <div class="form-group">
              <label for="idRol">Rol:</label>
              <select v-model="form.IdRol" required>
                <option v-for="rol in roles" :key="rol.IdRol" :value="rol.IdRol">
                  {{ rol.Rol }}
                </option>
              </select>
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
import Header from '@/components/Header';

export default {
  components: {
    Header,
  },
  data() {
    return {
      apiUrl: 'http://137.184.244.147/api/cliente',
      rolesUrl: 'http://137.184.244.147/api/rol',
      roles: [],
      clientes: [],
      modalOpen: false,
      deleteModalOpen: false,
      isEdit: false,
      form: {
        IdCliente: null,
        Nombre: '',
        Apellido: '',
        Correo: '',
        NIT: '',
        Contraseña: '',
        IdRol: 4,
      },
      clienteAEliminar: null,
    };
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get(this.apiUrl);
        this.clientes = response.data;
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },
    async fetchRoles() {
      try {
        const response = await axios.get(this.rolesUrl);
        this.roles = response.data;
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    },
    openModal(action, cliente = null) {
      this.modalOpen = true;
      this.isEdit = action === 'edit';
      if (cliente) {
        this.form = { ...cliente, Contraseña: '' };
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
      this.clienteAEliminar = id;
    },
    closeDeleteModal() {
      this.deleteModalOpen = false;
      this.clienteAEliminar = null;
    },
    async confirmDelete() {
      try {
        await axios.delete(`${this.apiUrl}/${this.clienteAEliminar}`);
        this.fetchClientes();
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      } finally {
        this.closeDeleteModal();
      }
    },
    resetForm() {
      this.form = {
        IdCliente: null,
        Nombre: '',
        Apellido: '',
        Correo: '',
        NIT: '',
        Contraseña: '',
        IdRol: 4,
      };
    },
    async submitForm() {
      try {
        if (this.isEdit) {
          await axios.put(`${this.apiUrl}/${this.form.IdCliente}`, this.form);
        } else {
          await axios.post(this.apiUrl, this.form);
        }
        this.closeModal();
        this.fetchClientes();
      } catch (error) {
        console.error('Error al guardar el cliente:', error);
      }
    },
  },
  mounted() {
    this.fetchClientes();
    this.fetchRoles();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
.client-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.client-table th,
.client-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.client-table th {
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
.form-group input,
.form-group select {
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
  .client-table th,
  .client-table td {
    font-size: 12px;
  }
}
@media (max-width: 576px) {
  .btn {
    padding: 8px 10px;
    font-size: 12px;
  }
  .client-table th,
  .client-table td {
    padding: 6px;
  }
  .modal-content {
    margin: 10% auto;
    padding: 15px;
  }
}
</style>
