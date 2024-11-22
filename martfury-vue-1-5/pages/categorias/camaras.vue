<template>
    <div class="products-container">
      <h1>Camaras</h1>
      <div class="products-list">
        <ProductCard v-for="product in products" :key="product.IdProducto" :product="product" />
      </div>
    </div>
  </template>
  
  <script>
  import ProductCard from '~/components/elements/product/ProductCart.vue';
  import axios from 'axios';
  
  export default {
    components: { ProductCard },
    data() {
      return {
        products: [],
      };
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await axios.get('http://137.184.244.147/api/productos/categoria/4');
          this.products = response.data;
        } catch (error) {
          console.error('Error al obtener productos:', error);
        }
      },
    },
    mounted() {
      this.fetchProducts();
    },
  };
  </script>
  
  <style scoped>
  .products-container {
    text-align: center;
    padding: 20px;
  }
  .products-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  </style>
  