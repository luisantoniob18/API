<template lang="html">
    <ul class="menu--dropdown">
        <li v-for="item in menuCategories" :key="item.categoria">
            <nuxt-link :to="localePath(item.url)">
                {{ item.categoria }}
            </nuxt-link>
        </li>
    </ul>
</template>

<script>
import axios from 'axios';

export default {
    name: 'MenuCategories',
    data() {
        return {
            menuCategories: []  
        };
    },
    mounted() {
        this.fetchMenuCategories();
    },
    methods: {
        async fetchMenuCategories() {
            // Mapeo de categorías a URLs
            const urlMapping = {
                'Televisores': '/categorias/televisores',
                'Telefonos': '/categorias/telefonos',
                'Audio':'/categorias/audio',
                'Camaras':'/categorias/camaras',
                'Computadoras':'/categorias/computadoras',
                
            };

            try {
                const response = await axios.get('http://137.184.244.147/api/categoria'); 
                this.menuCategories = response.data.map(item => ({
                    categoria: item.Categoria, 
                    url: urlMapping[item.Categoria] || '/default'
                }));
            } catch (error) {
                console.error('Error al obtener las categorías del menú:', error);
            }
        }
    }
};
</script>

<style lang="scss" scoped>

</style>