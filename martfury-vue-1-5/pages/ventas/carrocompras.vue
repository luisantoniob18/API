<template>
  <div class="cart">
    <h2>Carrito de Compras</h2>
    <div v-if="cartItems.length">
      <ul>
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="`data:image/jpeg;base64,${item.image}`" alt="Imagen del producto" class="cart-item-image" />
          <div class="cart-item-details">
            <h3>{{ item.name }}</h3>
            <p>Precio unitario: Q {{ parseFloat(item.price).toFixed(2) }}</p>
            <div class="cart-item-controls">
              <button @click="decreaseCartItemQuantity({ id: item.id })">-</button>
              <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.id, item.quantity)" min="1" />
              <button @click="increaseCartItemQuantity({ id: item.id })">+</button>
              <button @click="removeProductFromCart({ id: item.id })" class="remove-btn">Eliminar</button>
            </div>
            <p>Total: Q {{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </li>
      </ul>
      <div class="cart-summary">
        <p>Total de artículos: {{ total }}</p>
        <p>Monto total: Q {{ amount }}</p>
        <button @click="checkout" class="checkout-btn">Finalizar compra</button>
      </div>
    </div>
    <p v-else>El carrito está vacío.</p>

  
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <h3>Advertencia</h3>
        <p>Por favor, inicie sesión para finalizar su compra.</p>
        <button @click="redirectToLogin" class="modal-btn">Iniciar Sesión</button>
        <button @click="showModal = false" class="modal-btn cancel-btn">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Cart',
  data() {
    return {
      showModal: false
    };
  },
  computed: {
    ...mapState('cart', ['cartItems', 'total', 'amount']),
    ...mapState('auth', ['isLoggedIn'])  
  },
  methods: {
    ...mapActions('cart', [
      'removeProductFromCart',
      'increaseCartItemQuantity',
      'decreaseCartItemQuantity'
    ]),
    updateQuantity(id, quantity) {
      if (quantity > 0) {
        const item = this.cartItems.find((item) => item.id === id);
        if (item) {
          if (quantity > item.quantity) {
            this.increaseCartItemQuantity({ id });
          } else if (quantity < item.quantity) {
            this.decreaseCartItemQuantity({ id });
          }
        }
      }
    },
    checkout() {
     
      if (!this.isLoggedIn) {
    
        this.showModal = true;
      } else {
        
        this.$router.push('/ventas/checkout');
      }
    },
    redirectToLogin() {
      this.showModal = false;
      this.$router.push('/account/login');
    }
  }
};
</script>

<style scoped>
.cart {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}
.cart h2 {
  text-align: center;
}
.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 8px;
}
.cart-item-details {
  flex: 1;
}
.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}
.cart-item-controls input {
  width: 50px;
  text-align: center;
}
.cart-item-controls button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9em;
  transition: background-color 0.3s;
}
.cart-item-controls button:hover {
  background-color: #0056b3;
}
.remove-btn {
  background-color: #dc3545;
}
.remove-btn:hover {
  background-color: #c82333;
}
.cart-summary {
  text-align: center;
  margin-top: 20px;
}
.checkout-btn {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.checkout-btn:hover {
  background-color: #218838;
}

/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.modal-content h3 {
  margin: 0 0 10px;
}
.modal-content p {
  margin: 0 0 20px;
}
.modal-btn {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 5px;
}
.modal-btn:hover {
  background-color: #0056b3;
}
.cancel-btn {
  background-color: #dc3545;
}
.cancel-btn:hover {
  background-color: #c82333;
}
</style>
