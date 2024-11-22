<template>
  <div class="product-card">
    <img
      v-if="product.NombreImagen"
      :src="`data:image/jpeg;base64,${product.NombreImagen}`"
      alt="Imagen del producto"
      class="product-image"
    />
    <div class="product-details">
      <h2 class="product-name">{{ product.Nombre }}</h2>
      <p class="product-description">{{ product.Descripcion }}</p>
      <p class="product-price">Q {{ parseFloat(product.Precio).toFixed(2) }}</p>

      <!-- Icono debajo del precio -->
      <div
        class="stock-icon-container"
        @click="toggleModal"
      >
        <i class="stock-icon">📦</i>
      </div>

      <!-- Modal flotante -->
      <div v-if="showModal" class="floating-modal">
        <h4>Disponibilidad</h4>
        <ul>
          <li v-for="store in product.tiendas" :key="store.IdTienda">
            {{ store.NombreTienda }} - {{ store.Cantidad }}
          </li>
        </ul>
      </div>

      <button
        class="view-details-btn"
        :disabled="isOutOfStock"
        @click="addToCart"
      >
        {{ isOutOfStock ? "Agotado" : "Comprar" }}
      </button>

      <!-- Mensaje de notificación dentro del área de producto -->
      <p v-if="showNotification" class="notification">¡Producto agregado al carrito!</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showNotification: false,
      showModal: false, // Controla la visibilidad del modal flotante
    };
  },
  computed: {
    // Computada para verificar si el producto está agotado
    isOutOfStock() {
      return this.product.cantidad_total_inventarios === 0;
    },
  },
  methods: {
    ...mapActions("cart", ["addProductToCart"]),

    toggleModal() {
      this.showModal = !this.showModal;
    },

    addToCart() {
      if (!this.isOutOfStock) {
        const payload = {
          id: this.product.IdProducto,
          name: this.product.Nombre,
          price: this.product.Precio,
          quantity: 1,
          image: this.product.NombreImagen,
        };
        this.addProductToCart(payload);
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 2000); // Ocultar el mensaje después de 2 segundos
      }
    },

    handleOutsideClick(event) {
      const modal = this.$el.querySelector(".floating-modal");
      const stockIcon = this.$el.querySelector(".stock-icon-container");

      if (!modal?.contains(event.target) && !stockIcon?.contains(event.target)) {
        this.showModal = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  margin: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; /* Para posicionar el modal flotante */
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.product-details {
  padding: 20px;
}
.product-price {
  font-size: 1.2em;
  font-weight: bold;
  color: #e91e63;
  margin-bottom: 10px;
}
.stock-icon-container {
  margin: 10px 0;
  text-align: center;
  cursor: pointer;
}
.stock-icon {
  font-size: 1.5em;
  color: #007bff;
  transition: color 0.3s ease;
}
.stock-icon:hover {
  color: #0056b3;
}
.floating-modal {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 0.85em;
  width: 200px;
  z-index: 1000;
}
.floating-modal h4 {
  margin: 0 0 10px;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
}
.floating-modal ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.floating-modal ul li {
  margin: 5px 0;
  font-size: 0.9em;
  color: #555;
}
.view-details-btn {
  padding: 12px 20px;
  font-size: 0.9em;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.view-details-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
.view-details-btn:hover:not(:disabled) {
  background-color: #218838;
}
.notification {
  background-color: #28a745;
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.9em;
  margin-top: 10px;
  animation: fade 2s ease;
}
@keyframes fade {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  .product-card {
    max-width: 100%;
    margin: 10px 0;
  }
  .product-details {
    padding: 15px;
  }
  .floating-modal {
    font-size: 0.8em;
    width: 180px;
  }
  .product-image {
    height: 180px;
  }
}
@media (max-width: 576px) {
  .product-card {
    max-width: 100%;
    margin: 5px 0;
  }
  .product-image {
    height: 150px;
  }
  .product-details {
    padding: 10px;
  }
  .floating-modal {
    width: 160px;
    font-size: 0.75em;
  }
  .view-details-btn {
    font-size: 0.8em;
    padding: 10px;
  }
}
</style>
