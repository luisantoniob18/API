<template lang="html">
    <form @submit.prevent="handleSubmit">
      <div class="ps-form__content">
        <h5>Registrarme</h5>
  
        <!-- Campo Nombre -->
        <div class="form-group">
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            @input="$v.name.$touch()"
            placeholder="Nombre"
            class="ps-text-field"
            outlined
            height="50"
          />
        </div>
  
        <!-- Campo Apellido -->
        <div class="form-group">
          <v-text-field
            v-model="surname"
            :error-messages="surnameErrors"
            @input="$v.surname.$touch()"
            placeholder="Apellido"
            class="ps-text-field"
            outlined
            height="50"
          />
        </div>
  
        <!-- Campo NIT -->
        <div class="form-group">
          <v-text-field
            v-model="nit"
            :error-messages="nitErrors"
            @input="$v.nit.$touch()"
            placeholder="NIT (opcional)"
            class="ps-text-field"
            outlined
            height="50"
          />
        </div>
  
        <!-- Campo Correo -->
        <div class="form-group">
          <v-text-field
            v-model="username"
            :error-messages="usernameErrors"
            @input="$v.username.$touch()"
            placeholder="Email Address"
            class="ps-text-field"
            outlined
            height="50"
          />
        </div>
  
        <!-- Campo Contraseña -->
        <div class="form-group">
          <v-text-field
            v-model="password"
            :error-messages="passwordErrors"
            @input="$v.password.$touch()"
            placeholder="Password"
            class="ps-text-field"
            outlined
            height="50"
            type="password"
          />
        </div>
  
        <!-- Botón de registro -->
        <div class="form-group submit">
          <button type="submit" class="ps-btn ps-btn--fullwidth">
            Register
          </button>
        </div>
      </div>
    </form>
  </template>
  
  <script>
  import { required, email } from 'vuelidate/lib/validators';
  import axios from 'axios';
  
  export default {
    name: 'Register',
    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.name.$dirty) return errors;
        !this.$v.name.required && errors.push('Este campo es obligatorio');
        return errors;
      },
      surnameErrors() {
        const errors = [];
        if (!this.$v.surname.$dirty) return errors;
        !this.$v.surname.required && errors.push('Este campo es obligatorio');
        return errors;
      },
      nitErrors() {
        const errors = [];
        if (!this.$v.nit.$dirty) return errors;
        // No required validation for NIT
        return errors;
      },
      usernameErrors() {
        const errors = [];
        if (!this.$v.username.$dirty) return errors;
        !this.$v.username.required && errors.push('Este campo es obligatorio');
        !this.$v.username.email && errors.push('Ingrese un correo válido');
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
        name: null,
        surname: null,
        nit: null, // Campo opcional
        username: null,
        password: null
      };
    },
    validations: {
      name: { required },
      surname: { required },
      nit: {}, // No se valida como requerido
      username: { required, email },
      password: { required }
    },
    methods: {
      async handleSubmit() {
        // Marcar todos los campos como tocados para mostrar los errores
        this.$v.$touch();
  
        // Si hay algún campo no válido, detener el proceso
        if (this.$v.$invalid) return;
  
        try {
          // Realizar la llamada a la API para registrar al cliente
          const response = await axios.post('http://137.184.244.147/api/cliente', {
            Nombre: this.name,
            Apellido: this.surname,
            Correo: this.username,
            Contraseña: this.password,
            Nit: this.nit || '', // El NIT es opcional, por lo que si está vacío, lo enviamos como cadena vacía
          });
  
          // Si el registro es exitoso, redirigir al inicio de sesión
          if (response.data.message === 'Cliente creado con éxito') {
            this.$router.push('/account/login'); // Redirigir a la página de login
          } else {
            // Si hay un error en el registro, mostrarlo
            alert('Error al registrar el cliente. Intenta de nuevo.');
          }
        } catch (error) {
          console.error(error);
          alert('Ocurrió un error al registrar al cliente. Intenta de nuevo.');
        }
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  /* Puedes agregar estilos personalizados aquí si lo deseas */
  </style>
  