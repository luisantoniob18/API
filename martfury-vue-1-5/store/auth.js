export const state = () => ({
  isLoggedIn: false,
  nombre: '',
  apellido: '',
  IdCliente: null,  // Agregamos IdCliente aquí
  IdRol: null
});

export const mutations = {
  setAuthStatus(state, payload) {
      state.isLoggedIn = payload.isLoggedIn;
      state.nombre = payload.nombre;
      state.apellido = payload.apellido;
      state.IdCliente = payload.IdCliente;  // Guardamos IdCliente
      state.IdRol = payload.IdRol;
  },
  setIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
  }
};

export const actions = {
  // Acción para establecer el estado de autenticación
  setAuthStatus({ commit }, payload) {
      commit('setAuthStatus', payload);

      // Guardar la información del usuario en las cookies
      const cookieParams = {
          isLoggedIn: payload.isLoggedIn,
          nombre: payload.nombre,
          apellido: payload.apellido,
          IdCliente: payload.IdCliente,  // Guardamos IdCliente en la cookie
          IdRol: payload.IdRol
      };

      this.$cookies.set('auth', cookieParams, {
          path: '/',
          maxAge: 60*60*3 // 10min
      });
  },

  // Acción para leer los datos desde las cookies al recargar la página
  initializeAuth({ commit }) {
      const authCookie = this.$cookies.get('auth');
      if (authCookie) {
          commit('setAuthStatus', {
              isLoggedIn: authCookie.isLoggedIn,
              nombre: authCookie.nombre,
              apellido: authCookie.apellido,
              IdCliente: authCookie.IdCliente,  // Leemos IdCliente desde la cookie
              IdRol: authCookie.IdRol
          });
      }
  },

  // Acción para limpiar los datos de autenticación y eliminar la cookie
  logout({ commit }) {
      commit('setAuthStatus', {
          isLoggedIn: false,
          nombre: '',
          apellido: '',
          IdCliente: null,
          IdRol: null
      });

      this.$cookies.remove('auth'); // Eliminar la cookie al hacer logout
  }
};

export const getters = {
  getAuthStatus(state) {
      return {
          isLoggedIn: state.isLoggedIn,
          nombre: state.nombre,
          apellido: state.apellido,
          IdCliente: state.IdCliente,  // Incluir IdCliente en el getter
          IdRol: state.IdRol
      };
  }
};
