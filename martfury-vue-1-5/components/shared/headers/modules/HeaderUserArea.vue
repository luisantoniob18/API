<template lang="html">
    <div v-if="!isLoggedIn" class="ps-block--user-header">
      <div class="ps-block__left">
        <i class="icon-user"></i>
      </div>
      <div class="ps-block__right">
        <nuxt-link to="/account/login">
          {{ $t('header.login') }}
        </nuxt-link>
        <nuxt-link to="/account/register">
          {{ $t('header.register') }}
        </nuxt-link>
      </div>
    </div>
    <div v-else class="ps-block--user-account">
      <i class="icon-user"></i>
      <div class="ps-block__content">
        <ul class="ps-list--arrow">
          <!-- Mostrar nombre y apellido cuando el usuario esté logueado -->
          <li>
            <span>{{ nombre }} {{ apellido }}</span>
          </li>
          <li v-for="link in accountLinks" :key="link.text">
            <nuxt-link :to="link.url">
              {{ link.text }}
            </nuxt-link>
          </li>
          <li class="ps-block__footer">
            <a href="#" @click.prevent="handleLogout">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'HeaderUserArea',
    computed: {
      ...mapState({
        isLoggedIn: state => state.auth.isLoggedIn,
        nombre: state => state.auth.nombre, // Acceder al nombre desde Vuex
        apellido: state => state.auth.apellido // Acceder al apellido desde Vuex
      })
    },
    data() {
      return {
        accountLinks: [
          // Agregar enlaces adicionales para el usuario autenticado, si lo deseas
        ]
      };
    },
    methods: {
      handleLogout() {
        this.$store.dispatch('auth/logout'); // Limpiar el estado de autenticación y cookies
        this.$router.push('/account/login');
      }
    }
  };
  </script>
  
  <style lang="scss" scoped></style>
  