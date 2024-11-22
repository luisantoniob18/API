<template>
    <div class="mini-cart-item">
      <img :src="`data:image/jpeg;base64,${product.image}`" alt="Imagen del producto" class="mini-cart-image" />
      <div class="mini-cart-details">
        <h3 class="mini-cart-name">{{ product.name }}</h3>
        <p class="mini-cart-price">Precio: Q {{ parseFloat(product.price).toFixed(2) }}</p>
        <div class="mini-cart-controls">
          <button @click="decreaseQuantity(product.id)" class="mini-cart-btn">-</button>
          <span>{{ product.quantity }}</span>
          <button @click="increaseQuantity(product.id)" class="mini-cart-btn">+</button>
          <button @click="removeFromCart(product.id)" class="mini-cart-remove-btn">Eliminar</button>
        </div>
        <p class="mini-cart-total">Total: Q {{ (product.price * product.quantity).toFixed(2) }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'ProductMiniCart',
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
    methods: {
      ...mapActions('cart', [
        'removeProductFromCart',
        'increaseCartItemQuantity',
        'decreaseCartItemQuantity',
      ]),
      increaseQuantity(id) {
        this.increaseCartItemQuantity({ id });
      },
      decreaseQuantity(id) {
        if (this.product.quantity > 1) {
          this.decreaseCartItemQuantity({ id });
        }
      },
      removeFromCart(id) {
        this.removeProductFromCart({ id });
      },
    },
  };
  </script>
  
  <style scoped>
  .mini-cart-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  
  .mini-cart-image {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .mini-cart-details {
    flex: 1;
  }
  
  .mini-cart-name {
    font-size: 14px;
    margin: 0 0 5px;
  }
  
  .mini-cart-price, .mini-cart-total {
    font-size: 12px;
    margin: 0;
  }
  
  .mini-cart-controls {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .mini-cart-btn {
    padding: 3px 8px;
    font-size: 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .mini-cart-btn:hover {
    background-color: #0056b3;
  }
  
  .mini-cart-remove-btn {
    padding: 3px 8px;
    font-size: 12px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .mini-cart-remove-btn:hover {
    background-color: #c82333;
  }
  </style>
  