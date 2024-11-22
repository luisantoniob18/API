<template>
    <div>
      <h1 v-if="product">{{ product.name }}</h1>
      <div v-if="product">
        <ThumbnailCountDown :product="product" />
        <InformationFullContent :product="product" />
        <div class="ps-product__price-right">
          <h4 v-if="product.is_sale" class="ps-product__price sale">
            <del class="mr-2">${{ product.sale_price }}</del>
            ${{ product.price }}
          </h4>
          <h4 v-else class="ps-product__price">${{ product.price }}</h4>
        </div>
        <DescriptionFullContent :product="product" />
      </div>
      <div v-else>
        <p>Producto no encontrado.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { extended } from '~/static/data/product'; // Asegúrate de que esta sea la forma de obtener tus datos
  import ThumbnailCountDown from '~/components/elements/detail/thumbnail/ThumbnailCountDown';
  import InformationFullContent from '~/components/elements/detail/information/InformationFullContent';
  import DescriptionFullContent from '~/components/elements/detail/modules/DescriptionFullContent';
  
  export default {
    name: 'ProductDetail',
    components: {
      ThumbnailCountDown,
      InformationFullContent,
      DescriptionFullContent,
    },
    data() {
      return {
        product: null,
      };
    },
    async asyncData({ params }) {
      const productId = params.id;
  
      // Simulando la búsqueda del producto
      const product = extended.find(item => item.id === parseInt(productId));
  
      if (!product) {
        return { product: null }; // Devuelve null si no se encuentra el producto
      }
  
      return { product };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos si son necesarios */
  </style>
  