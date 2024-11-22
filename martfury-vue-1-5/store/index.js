// store/index.js
export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    // Cargar datos de las cookies
    const cartItems = this.$cookies.get('cart', { parseJSON: true });
    const wishlistItems = this.$cookies.get('wishlist', { parseJSON: true });
    const compareItems = this.$cookies.get('compare', { parseJSON: true });
    const auth = this.$cookies.get('auth', { parseJSON: true });
    const currency = this.$cookies.get('currency', { parseJSON: true });

    // Inicializar el carrito si hay datos guardados en las cookies
    if (cartItems && cartItems.cartItems.length > 0) {
      commit('cart/initCart', {
        cartItems: cartItems.cartItems,
        amount: cartItems.amount,
        total: cartItems.total,
      });
      
      // Opción para cargar productos adicionales desde el servidor si es necesario
      const productIds = cartItems.cartItems.map(item => item.id);
      if (productIds.length > 0) {
        await dispatch('product/getCartProducts', productIds);
      }
    }

    // Inicializar la lista de deseos
    if (wishlistItems) {
      commit('wishlist/initWishlist', {
        items: wishlistItems.items,
        total: wishlistItems.total,
      });
    }

    // Inicializar la comparación de productos
    if (compareItems) {
      commit('compare/initCompare', {
        items: compareItems.items,
        total: compareItems.total,
      });
    }

    // Inicializar autenticación
    if (auth) {
      commit('auth/setIsLoggedIn', Boolean(auth.isLoggedIn));
    }

    // Inicializar moneda
    if (currency) {
      commit('app/setCurrency', currency.data);
    }
  }
};
