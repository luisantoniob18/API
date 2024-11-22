<template>
  <div>
    <Header />

    <div class="container">
      <h1 class="title">Gestión de Productos</h1>
      <button class="btn add-btn" @click="openModal('add')">Agregar Producto</button>
      <div class="table-container">
        <table class="product-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.IdProducto">
              <td>{{ producto.Nombre }}</td>
              <td>{{ producto.Descripcion }}</td>
              <td>Q {{ parseFloat(producto.Precio).toFixed(2) }}</td>
              <td>
                <img 
                  :src="`data:image/jpeg;base64,${producto.NombreImagen}`" 
                  alt="Imagen del producto" 
                  class="product-image" 
                />
              </td>
              <td>{{ producto.categoria.Categoria }}</td>
              <td>
                <button class="btn edit-btn" @click="openModal('edit', producto)">Editar</button>
                <button class="btn delete-btn" @click="openDeleteModal(producto.IdProducto)">Eliminar</button>
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
          <p>¿Estás seguro de que deseas eliminar este producto?</p>
          <button class="btn delete-confirm-btn" @click="confirmDelete">Eliminar</button>
          <button class="btn cancel-btn" @click="closeDeleteModal">Cancelar</button>
        </div>
      </div>

      <!-- Modal de creación/edición -->
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close">&times;</span>
          <h2 class="modal-title">{{ isEdit ? 'Actualizar Producto' : 'Agregar Producto' }}</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="nombre">Nombre:</label>
              <input type="text" v-model="form.Nombre" required />
            </div>

            <div class="form-group">
              <label for="descripcion">Descripción:</label>
              <input type="text" v-model="form.Descripcion" required />
            </div>

            <div class="form-group">
              <label for="precio">Precio:</label>
              <input type="decimal" v-model="form.Precio" required />
            </div>

            <div class="form-group">
              <label for="nombreImagen">Imagen:</label>
              <input type="file" @change="handleImageUpload" />
            </div>

            <div class="form-group">
              <label for="idCategoria">Categoría:</label>
              <select v-model="form.IdCategoria" required>
                <option v-for="categoria in categorias" :key="categoria.IdCategoria" :value="categoria.IdCategoria">
                  {{ categoria.Categoria }}
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
      apiUrl: 'http://137.184.244.147/api/producto',
      categorias: [],
      productos: [],
      modalOpen: false,
      deleteModalOpen: false,
      isEdit: false,
      form: {
        IdProducto: null,
        Nombre: '',
        Descripcion: '',
        Precio: '',
        NombreImagen: '',
        IdCategoria: '',
      },
      productoAEliminar: null,
    };
  },
  methods: {
    async fetchProductos() {
      try {
        const response = await axios.get(this.apiUrl);
        this.productos = response.data;
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    },
    async fetchCategorias() {
      try {
        const response = await axios.get('http://137.184.244.147/api/categoria');
        this.categorias = response.data;
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    },
    openModal(action, producto = null) {
      this.modalOpen = true;
      this.isEdit = action === 'edit';
      if (producto) {
        this.form = { ...producto };
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
      this.productoAEliminar = id;
    },
    closeDeleteModal() {
      this.deleteModalOpen = false;
      this.productoAEliminar = null;
    },
    async confirmDelete() {
      try {
        await axios.delete(`${this.apiUrl}/${this.productoAEliminar}`);
        this.fetchProductos();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      } finally {
        this.closeDeleteModal();
      }
    },
    resetForm() {
      this.form = {
        IdProducto: null,
        Nombre: '',
        Descripcion: '',
        Precio: '',
        IdCategoria: '',
        NombreImagen: '',
      };
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Redimensionar la imagen
          const maxWidth = 200;
          const maxHeight = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir la imagen redimensionada a base64
          this.form.NombreImagen = canvas.toDataURL('image/jpeg').split(',')[1];
        };
      };

      reader.readAsDataURL(file);
    },
    async submitForm() {
      try {
        const payload = { ...this.form };

        if (this.isEdit) {
          await axios.put(`${this.apiUrl}/${this.form.IdProducto}`, payload);
        } else {
          await axios.post(this.apiUrl, payload);
        }
        this.closeModal();
        this.fetchProductos();
      } catch (error) {
        console.error('Error al guardar el producto:', error);
      }
    },
  },
  mounted() {
    this.fetchProductos();
    this.fetchCategorias();
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
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.product-table th {
  background-color: #f2f2f2;
  color: #333;
}
.table-container {
  overflow-x: auto; /* Responsividad para tablas */
}
.product-image {
  width: 100px;
  height: auto;
  object-fit: cover;
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
  .product-table th,
  .product-table td {
    font-size: 12px;
  }
}
@media (max-width: 576px) {
  .btn {
    padding: 8px 10px;
    font-size: 12px;
  }
  .product-table th,
  .product-table td {
    padding: 6px;
  }
  .modal-content {
    margin: 10% auto;
    padding: 15px;
  }
}
</style>
