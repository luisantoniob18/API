<template>
  <div class="panel-admin" v-if="isAuthorized">
    <h1>Bienvenido al panel de Gerente</h1>
    <div class="content">
      <div class="button-container">
        <router-link to="/ger/productos">
          <button class="nav-button">
            <i class="fas fa-box"></i> Productos
          </button>
        </router-link>
        <router-link to="/ger/inventarios">
          <button class="nav-button">
            <i class="fas fa-warehouse"></i> Inventarios
          </button>
        </router-link>
        <router-link to="/ger/usuarios">
          <button class="nav-button">
            <i class="fas fa-users"></i> Clientes
          </button>
        </router-link>
       
        <router-link to="/ger/reportes">
          <button class="nav-button">
            <i class="fas fa-chart-line"></i> Reportes
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelAdmin',
  data() {
    return {
      isAuthorized: false,
    };
  },
  methods: {
    checkAuthorization() {
      const authCookie = this.$cookies.get('auth');

      if (authCookie && authCookie.isLoggedIn && authCookie.IdRol === 2) {
        this.isAuthorized = true;
      } else {
        this.$router.push('/');
      }
    },
  },
  mounted() {
    this.checkAuthorization();
  },
};
</script>

<style scoped>
.panel-admin {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.content {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 400px;
}

.nav-button {
  padding: 20px 30px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button i {
  margin-right: 10px;
}

.nav-button:hover {
  background-color: #0056b3;
}
</style>
