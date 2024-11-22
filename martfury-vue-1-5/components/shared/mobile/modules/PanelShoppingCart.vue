<template lang="html">
    <div class="ps-panel--sidebar">
      <div class="ps-panel__header">
        <h3>Shopping Cart</h3>
        <a href="#" class="ps-panel__close" @click.prevent="handleClosePanel">
          <i class="icon icon-cross"></i>
        </a>
      </div>
      <div class="ps-panel__content">
        <div class="ps-cart--mobile">
          <div class="ps-cart__content">
            <!-- Mostrar productos si el carrito tiene items -->
            <div v-if="cartItems.length > 0" class="ps-cart__items">
              <product-mini-cart
                v-for="product in cartItems"
                :product="product"
                :key="product.id"
              />
            </div>
            <!-- Mensaje cuando el carrito está vacío -->
            <div v-else class="ps-cart__items">
              <span>No Product.</span>
            </div>
          </div>
          <div v-if="cartItems.length > 0" class="ps-cart__footer">
            <h3>Sub Total: <strong>Q {{ amount.toFixed(2) }}</strong></h3>
            <figure>
              <div>
                <nuxt-link to="/account/shopping-cart" class="ps-btn">
                  View Cart
                </nuxt-link>
              </div>
              <div>
                <nuxt-link to="/account/checkout" class="ps-btn ps-btn--black">
                  Checkout
                </nuxt-link>
              </div>
            </figure>
          </div>
          <div v-else class="ps-cart__footer">
            <nuxt-link to="/shop" class="ps-btn ps-btn--fullwidth">
              Shop now
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  import ProductMiniCart from '~/components/elements/product/ProductMiniCart';
  
  export default {
    name: 'PanelShoppingCart',
    components: { ProductMiniCart },
    computed: {
      ...mapState('cart', {
        cartItems: state => state.cartItems,  // Obtener items del carrito
        amount: state => state.amount         // Obtener el monto total del carrito
      })
    },
    methods: {
      handleClosePanel() {
        this.$store.commit('app/setCurrentDrawerContent', null);
        this.$store.commit('app/setAppDrawer', false);
      }
    }
  };
  </script>
  