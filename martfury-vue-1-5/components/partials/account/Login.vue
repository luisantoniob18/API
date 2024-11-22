<template lang="html">
  <form @submit.prevent="handleSubmit">
    <div class="ps-form__content">
      <h5>Iniciar Sesion</h5>

      <!-- Campo de Username o Correo -->
      <div class="form-group">
        <v-text-field
          v-model="username"
          class="ps-text-field"
          :error-messages="usernameErrors"
          @input="$v.username.$touch()"
          placeholder="Username o correo electrónico"
          height="50"
          outlined
        />
      </div>

      <!-- Campo de Contraseña -->
      <div class="form-group">
        <v-text-field
          v-model="password"
          type="password"
          class="ps-text-field"
          :error-messages="passwordErrors"
          @input="$v.password.$touch()"
          placeholder="Por favor ingrese la contraseña"
          height="50"
          outlined
        />
      </div>

      <div class="form-group submit">
        <button
          type="submit"
          class="ps-btn ps-btn--fullwidth"
        >
          Iniciar
        </button>
      </div>
    </div>

    <!-- Mensaje de error del servidor si ocurre -->
    <div v-if="serverError" class="ps-form__footer">
      <div class="error-message">
        <p>{{ serverError }}</p>
      </div>
    </div>
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import axios from 'axios';

export default {
  name: 'Login',
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push('Este campo es obligatorio');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('Este campo es obligatorio');
      return errors;
    }
  },
  data() {
    return {
      username: null,
      password: null,
      serverError: null // Para mostrar errores del servidor
    };
  },
  validations: {
    username: { required },
    password: { required }
  },
  methods: {
    async handleSubmit() {
      // Marcar todos los campos como tocados para mostrar los errores
      this.$v.$touch();

      // Si la validación es incorrecta, no hacer nada
      if (this.$v.$invalid) return;

      this.serverError = null; // Resetear mensaje de error

      try {
        // Realizar la llamada a la API para verificar el login
        const response = await axios.post('http://137.184.244.147/api/login', {
          Correo: this.username,
          Contraseña: this.password
        });

        // Si la respuesta es exitosa, actualizar el estado en Vuex y redirigir
        if (response.data.success) {
          const clienteData = {
            IdCliente: response.data.Cliente.IdCliente, // Usa IdCliente para mantener consistencia
            nombre: response.data.Cliente.nombre,
            apellido: response.data.Cliente.apellido,
            IdRol: response.data.Cliente.IdRol
          };

          // Guardar el estado de autenticación en Vuex
          this.$store.dispatch('auth/setAuthStatus', {
            isLoggedIn: true,
            nombre: clienteData.nombre,
            apellido: clienteData.apellido,
            IdRol: clienteData.IdRol,
            IdCliente: clienteData.IdCliente,
          });

          // Mostrar en la consola los datos completos del cliente
          console.log('Datos del cliente que inició sesión:', clienteData);

          // Redirigir al usuario al inicio o a la página que prefieras
          this.$router.push('/');
        } else {
          // Si las credenciales son incorrectas, mostrar el mensaje de error
          this.serverError = 'Credenciales incorrectas. Intenta de nuevo.';
        }
      } catch (error) {
        // En caso de error (por ejemplo, problemas con la red o el servidor), mostrar un error genérico
        this.serverError = 'Ocurrió un error en la autenticación. Intenta de nuevo.';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}

.error-message p {
  margin: 0;
  font-size: 1.1rem;
}
</style>
