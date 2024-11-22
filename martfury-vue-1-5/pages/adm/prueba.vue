<template>
  <div class="panel-admin">
    <h1>Bienvenido al panel de Administración</h1>
    <div class="content">
      <div class="button-container">
        <router-link to="/a">
          <button class="nav-button">
            <i class="fas fa-home"></i> Productos
          </button>
        </router-link>
        <router-link to="/b">
          <button class="nav-button">
            <i class="fas fa-user"></i> Inventarios
          </button>
        </router-link>
        <router-link to="/c">
          <button class="nav-button">
            <i class="fas fa-cog"></i> Clientes
          </button>
        </router-link>
        <router-link to="/d">
          <button class="nav-button">
            <i class="fas fa-envelope"></i> Ir a D
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelAdmin',
  components: {
    // Aquí puedes registrar otros componentes si es necesario
  },
};
</script>

<style scoped>
.panel-admin {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Centra el título horizontalmente */
}

.content {
  display: flex;
  justify-content: center;
  width: 100%; /* Asegura que el contenido ocupe todo el ancho */
  padding: 20px;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Espacio entre botones */
  max-width: 400px; /* Limita el ancho del contenedor */
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
  justify-content: center; /* Centra el contenido horizontalmente */
}

.nav-button i {
  margin-right: 10px;
}

.nav-button:hover {
  background-color: #0056b3;
}
</style>
