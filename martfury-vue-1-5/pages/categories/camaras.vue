<template>
  <div>
    <h1>Camaras</h1>
    <div class="products-list">
      <div v-for="(product, index) in products" :key="index">
  <div>
    {{ product.IdProducto }} <!-- Aquí deberías ver el valor del ID si 'IdProducto' es el nombre correcto -->
  </div>
  <nuxt-link :to="`/product/${product.IdProducto}`">
    <ProductSimple :product="product" />
  </nuxt-link>
</div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductSimple from '@/components/elements/product/ProductSimple';

export default {
  components: {
    ProductSimple,
  },
  data() {
    return {
      products: [],
      productId: null,  // Guardar el ID del producto seleccionado
    };
  },
  async mounted() {
    console.log(this.products);
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://137.184.244.147/api/productos');
        console.log('Respuesta de la API:', response);
        this.products = response.data.filter(product => product.IdCategoria === 4);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    },
    saveProductId(id) {
      this.productId = id;  // Guardar el ID del producto seleccionado
      console.log('ID del producto seleccionado:', this.productId);
    }
  },
};
</script>


<style scoped>
.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

nuxt-link {
  text-decoration: none;
}
</style>
