<template lang="html">
    <!-- Verificamos si product.thumbnail.url existe antes de usarlo -->
    <nuxt-link :to="`/product/${product.id}`">
        <img
            v-if="product && product.thumbnail && product.thumbnail.url"
            :src="`${baseUrl}${product.thumbnail.url}`"
            alt="Product Thumbnail"
        />
        <!-- Si no existe, mostramos una imagen predeterminada -->
        <img
            v-else
            src="/img/default-thumbnail.jpg" 
            alt="Default Thumbnail"
        />
    </nuxt-link>
</template>

<script>
import { baseUrl } from '~/repositories/Repository';
export default {
    name: 'ModuleProductThumbnailImage',
    props: {
        product: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        baseUrl() {
            return baseUrl;
        }
    }
};
</script>

<style lang="scss" scoped>
/* Estilos para las imágenes */
img {
    max-width: 100%;
    height: auto;
}
</style>
