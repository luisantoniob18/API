<template lang="html">
    <ul :class="className">
      <template v-for="item in mainMenu">
        <MenuDropdown v-if="item.subMenu" :menu-data="item" />
        <MenuMega v-else-if="item.mega" :menu-data="item" />
  
        <!-- Condicional para "Administrador" -->
        <li
          v-else
          :key="item.text"
          v-if="(item.text !== 'ADMINISTRADOR' || (item.text === 'ADMINISTRADOR' && isAdmin)) && (item.text !== 'GERENTE' || (item.text === 'GERENTE' && isManager))"
        >
          <nuxt-link :to="localePath(item.url)">
            {{ item.text }}
          </nuxt-link>
        </li>
      </template>
    </ul>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import MenuDropdown from './MenuDropdown';
  import MenuMega from './MenuMega';
  
  export default {
    name: 'MenuDefault',
    components: { MenuMega, MenuDropdown },
    props: {
      className: {
        type: String,
        default: 'menu'
      }
    },
    computed: {
      ...mapState('auth', ['IdRol']), // Acceder a IdRol desde Vuex
  
      // Computed property para saber si el usuario es un Administrador
      isAdmin() {
        return this.IdRol === 1;
      },
  
      // Computed property para saber si el usuario es un Gerente
      isManager() {
        return this.IdRol === 2;
      }
    },
    data() {
      return {
        mainMenu: [
          {
            text: this.$i18n.t('menu.mainMenu.home'),
            url: '/'
          },
          {
            text: this.$i18n.t('menu.mainMenu.Acercade'),
            url: '/page/about-us'
          },
          {
            text: this.$i18n.t('menu.mainMenu.Tiendas'),
            url: '/page/contact-us'
          },
          {
            text: 'ADMINISTRADOR', // Este es el ítem que solo se verá si es administrador
            url: '/adm/menu2'
          },
          {
            text: 'GERENTE', // Este es el ítem que solo se verá si es gerente
            url: '/ger/menu'
          }
        ]
      };
    }
  };
  </script>
  
  <style lang="scss" scoped></style>
  