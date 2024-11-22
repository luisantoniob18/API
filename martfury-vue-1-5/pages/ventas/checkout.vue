<template>
  <div class="checkout">
    <h2>Finalizar Compra o Cotización</h2>
    <div class="checkout-container">
      <div class="checkout-form">
        <h3>Detalles de Envío</h3>
        <form @submit.prevent="submitVenta">
          <div class="form-group">
            <label for="firstName">Nombre:</label>
            <input v-model="firstName" type="text" id="firstName" readonly required />
          </div>
          <div class="form-group">
            <label for="lastName">Apellido:</label>
            <input v-model="lastName" type="text" id="lastName" readonly required />
          </div>
          <div class="form-group">
            <label for="address">Dirección de envío:</label>
            <input
              v-model="address"
              type="text"
              id="address"
              required
              :class="{ 'is-invalid': addressError }"
              @blur="validateAddress"
            />
            <span v-if="addressError" class="error-message">Este campo es obligatorio</span>
          </div>
          <div class="checkout-summary">
            <p>Total a pagar: <strong>Q {{ amount }}</strong></p>
          </div>
          <div class="button-group">
            <button type="submit" class="checkout-btn">Finalizar Compra</button>
            <button type="button" @click="openCotizacionModal" class="checkout-btn-cotizacion">Realizar Cotización</button>
          </div>
        </form>
      </div>
      <div class="checkout-cart-items">
        <h3>Resumen del Carrito</h3>
        <ul>
          <li v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="`data:image/jpeg;base64,${item.image}`" alt="Imagen del producto" class="cart-item-image" />
            <div class="cart-item-details">
              <h4>{{ item.name }}</h4>
              <p>Cantidad: {{ item.quantity }}</p>
              <p>Precio unitario: Q {{ parseFloat(item.price).toFixed(2) }}</p>
              <p>Total: Q {{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="showCotizacionModal" class="modal">
      <div class="modal-content">
        <h3>¿Está seguro de realizar la cotización?</h3>
        <p>Se generará una cotización basada en los productos del carrito.</p>
        <div class="modal-buttons">
          <button @click="submitCotizacion" class="modal-btn-confirm">Confirmar Cotización</button>
          <button @click="closeCotizacionModal" class="modal-btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="showModal && isVenta" class="modal">
      <div class="modal-content">
        <h3>Compra completada</h3>
        <p>Gracias por su compra!</p>
        <button @click="closeModal" class="modal-close-btn">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  name: 'Checkout',
  data() {
    return {
      firstName: '',
      lastName: '',
      address: '',
      addressError: false,
      showModal: false,
      showCotizacionModal: false,
      isVenta: false,
    };
  },
  computed: {
    ...mapState('cart', {
      cartItems: state => state.cartItems,
      amount: state => state.amount,
    }),
    ...mapState('auth', {
      nombre: state => state.nombre,
      apellido: state => state.apellido,
      IdCliente: state => state.IdCliente,
    }),
  },
  methods: {
    validateAddress() {
      this.addressError = !this.address.trim();
    },
    async submitVenta() {
      this.validateAddress();
      if (!this.addressError) {
        try {
          const response = await axios.post(
            'http://137.184.244.147/api/ventas',
            {
              IdCliente: this.IdCliente,
              address: this.address,
              amount: this.amount,
              items: this.cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
              })),
            },
            { responseType: 'blob' }
          );
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Factura.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$store.dispatch('cart/clearCart');
          this.firstName = '';
          this.lastName = '';
          this.address = '';
          this.isVenta = true;
          this.showModal = true;
        } catch (error) {
          alert('Ocurrió un error. Intente nuevamente.');
        }
      } else {
        alert('Por favor, complete todos los campos obligatorios.');
      }
    },
    openCotizacionModal() {
      this.showCotizacionModal = true;
    },
    async submitCotizacion() {
      this.validateAddress();
      if (!this.addressError) {
        try {
          const response = await axios.post(
            'http://137.184.244.147/api/cotizaciones',
            {
              IdCliente: this.IdCliente,
              address: this.address,
              amount: this.amount,
              items: this.cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
              })),
            },
            { responseType: 'blob' }
          );
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Cotizacion.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$store.dispatch('cart/clearCart');
          this.firstName = '';
          this.lastName = '';
          this.address = '';
          this.showCotizacionModal = false;
          this.isVenta = false;
          this.showModal = true;
          this.$router.push('/');
        } catch (error) {
          alert('Ocurrió un error. Intente nuevamente.');
        }
      } else {
        alert('Por favor, complete todos los campos obligatorios.');
      }
    },
    closeCotizacionModal() {
      this.showCotizacionModal = false;
    },
    closeModal() {
      this.showModal = false;
      this.$router.push('/');
    },
  },
  created() {
    this.firstName = this.nombre;
    this.lastName = this.apellido;
  },
};
</script>

<style scoped>
.checkout {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.checkout-container {
  display: flex;
  gap: 20px;
}

.checkout-form, .checkout-cart-items {
  flex: 1;
}

.checkout-form {
  padding-right: 20px;
  border-right: 1px solid #ddd;
}

.checkout-form h3,
.checkout-cart-items h3 {
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.checkout-summary {
  margin-top: 20px;
  font-size: 1.2em;
  text-align: center;
}

.checkout-btn, .checkout-btn-cotizacion {
  width: 100%;
  padding: 10px 0;
  font-size: 1em;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #218838;
}

.checkout-btn-cotizacion {
  background-color: #ffc107; 
}

.checkout-btn-cotizacion:hover {
  background-color: #e0a800; 
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-cart-items ul {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.cart-item-image {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-details h4 {
  margin: 0;
  font-size: 16px;
}

.cart-item-details p {
  margin: 5px 0;
  font-size: 14px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-btn-confirm {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-btn-confirm:hover {
  background-color: #218838;
}

.modal-btn-cancel {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-btn-cancel:hover {
  background-color: #c82333;
}

.modal-close-btn {
  margin-top: 15px;
  padding: 8px 15px;
  font-size: 1em;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-close-btn:hover {
  background-color: #218838;
}

.is-invalid {
  border-color: red;
  outline: none;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}

</style>
