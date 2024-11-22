// store/cart.js

// Función para calcular el monto total del carrito
const calculateAmount = (items) => {
  return items.reduce((acc, { quantity, price }) => acc + quantity * price, 0).toFixed(2);
};

// Función para calcular el total de artículos en el carrito
const calculateTotalItems = (items) => {
  return items.reduce((acc, { quantity }) => acc + quantity, 0);
};

export const state = () => ({
  total: 0,          // Número total de artículos en el carrito
  amount: 0,         // Monto total del carrito
  cartItems: [],     // Lista de productos en el carrito
  loading: false     // Estado de carga (opcional)
});

export const mutations = {
  // Inicializar el carrito con datos existentes (vacío por defecto)
  initCart(state, payload = { cartItems: [], amount: 0, total: 0 }) {
    state.cartItems = payload.cartItems;
    state.amount = payload.amount;
    state.total = calculateTotalItems(state.cartItems);
  },

  // Cambiar el estado de carga
  setLoading(state, payload) {
    state.loading = payload;
  },

  // Agregar un producto al carrito
  addItem(state, payload) {
    const existItem = state.cartItems.find(item => item.id === payload.id);
    if (existItem) {
      existItem.quantity += payload.quantity;
    } else {
      state.cartItems.push({
        id: payload.id,
        name: payload.name,
        price: payload.price,
        quantity: payload.quantity,
        image: payload.image
      });
    }
    state.total = calculateTotalItems(state.cartItems); // Actualizar el número total de artículos en el carrito
    state.amount = calculateAmount(state.cartItems); // Calcular el monto total
  },

  // Eliminar un producto del carrito
  removeItem(state, payload) {
    const index = state.cartItems.findIndex(item => item.id === payload.id);
    if (index !== -1) {
      state.cartItems.splice(index, 1);
      state.total = calculateTotalItems(state.cartItems); // Actualizar el número total de artículos en el carrito
      state.amount = calculateAmount(state.cartItems); // Calcular el monto total
    }
  },

  // Incrementar la cantidad de un producto en el carrito
  increaseItemQuantity(state, payload) {
    const selectedItem = state.cartItems.find(item => item.id === payload.id);
    if (selectedItem) {
      selectedItem.quantity++;
      state.total = calculateTotalItems(state.cartItems); // Actualizar el número total de artículos en el carrito
      state.amount = calculateAmount(state.cartItems); // Calcular el monto total
    }
  },

  // Reducir la cantidad de un producto en el carrito
  decreaseItemQuantity(state, payload) {
    const selectedItem = state.cartItems.find(item => item.id === payload.id);
    if (selectedItem && selectedItem.quantity > 1) {
      selectedItem.quantity--;
      state.total = calculateTotalItems(state.cartItems); // Actualizar el número total de artículos en el carrito
      state.amount = calculateAmount(state.cartItems); // Calcular el monto total
    }
  },

  // Limpiar el carrito
  clearCart(state) {
    state.cartItems = [];
    state.amount = 0;
    state.total = 0;
  }
};

export const actions = {
  // Acción para agregar un producto al carrito
  addProductToCart({ commit }, payload) {
    commit('addItem', payload);
  },

  // Acción para eliminar un producto del carrito
  removeProductFromCart({ commit }, payload) {
    commit('removeItem', payload);
  },

  // Acción para incrementar la cantidad de un producto
  increaseCartItemQuantity({ commit }, payload) {
    commit('increaseItemQuantity', payload);
  },

  // Acción para reducir la cantidad de un producto
  decreaseCartItemQuantity({ commit }, payload) {
    commit('decreaseItemQuantity', payload);
  },

  // Acción para limpiar el carrito
  clearCart({ commit }) {
    commit('clearCart');
  },

  // Acción para inicializar el carrito (vacío al inicio)
  initCart({ commit }) {
    commit('clearCart');
  }
};

// Asegura que el módulo esté namespaced, para que pueda ser accedido como `cart/addProductToCart`, etc.
export const namespaced = true;
