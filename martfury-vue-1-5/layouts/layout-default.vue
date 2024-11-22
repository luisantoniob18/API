<template lang="html">
  <client-only>
      <v-app>
          <v-main>
              <header-default />
              <header-mobile />
              <nuxt />
              <footer-fullwidth />
              <navigation-list />
              <mobile-drawer />
              <notify />
          </v-main>
      </v-app>
  </client-only>
</template>

<script>
import HeaderDefault from '~/components/shared/headers/HeaderDefault';
import HeaderMobile from '~/components/shared/mobile/HeaderMobile';
import FooterFullwidth from '~/components/shared/footers/FooterFullwidth';
import Notify from '~/components/elements/commons/notify';

export default {
name: 'layout-default',
components: {
  FooterFullwidth,
  HeaderMobile,
  HeaderDefault,
  Notify
},
async mounted() {
  // Llamar a la acción 'initializeAuth' para cargar la autenticación desde las cookies al iniciar
  await this.$store.dispatch('auth/initializeAuth');
}
};
</script>

<style lang="scss" scoped></style>
