<template>
  <div class="panel-admin">
    <h1>Bienvenido al panel de Administrador</h1>
    <div class="content">
      <div class="button-container">
        <router-link to="/adm/productos">
          <button class="nav-button">
            <i class="fas fa-box"></i> Productos
          </button>
        </router-link>
        <router-link to="/adm/tiendas">
          <button class="nav-button">
            <i class="fas fa-store"></i> Tiendas
          </button>
        </router-link>
        <router-link to="/adm/traslado">
          <button class="nav-button">
            <i class="fas fa-exchange-alt"></i> Traslado
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelAdmin',
  beforeCreate() {
    const authCookie = this.$cookies.get('auth');
    if (!authCookie || !authCookie.isLoggedIn || authCookie.IdRol !== 1) {
      this.$router.push('/');
    }
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
  justify-content: center;
  gap: 20px;
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
