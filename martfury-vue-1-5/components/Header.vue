<template>
  <div>
    <!-- Contenedor del sidebar -->
    <div class="sidebar-container">
      <!-- Sidebar como pestañita -->
      <div class="sidebar" @mouseover="toggleSidebar" @mouseleave="toggleSidebar">
        <h1 class="sidebar-title">Panel Gerencia</h1>
        <nav class="sidebar-nav" aria-label="Main Navigation">
          <ul class="sidebar-menu">
            <li class="sidebar-item">
              <router-link to="/ger/usuarios" class="sidebar-link">Usuarios</router-link>
            </li>
            <li class="sidebar-item">
              <router-link to="/ger/productos" class="sidebar-link">Productos</router-link>
            </li>
            <li class="sidebar-item">
              <router-link to="/ger/inventarios" class="sidebar-link">Inventarios</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isSidebarVisible: false,  // Controla la visibilidad del sidebar
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;  // Alterna la visibilidad
    }
  }
};
</script>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 100px;  /* Ajusta este valor para mover el sidebar hacia abajo */
  left: 0;
  z-index: 1000;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #ffbc04;
  color: white;
  width: 50px; /* Ancho inicial pequeño (pestañita) */
  height: 170px; /* Altura pequeña */
  position: fixed;
  top: 370px;  /* Ajusta este valor para mover el sidebar hacia abajo */
  left: 0;
  transition: width 0.3s ease, height 0.3s ease; /* Transición suave para ancho y alto */
  padding: 10px;
  overflow: hidden;
}

.sidebar:hover {
  width: 200px; /* Ancho completo cuando el mouse pasa por encima */
  height: 200px; /* Aumenta la altura cuando el sidebar está expandido */
}

.sidebar-title {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
  display: none; /* Inicialmente oculto */
}

.sidebar:hover .sidebar-title {
  display: block; /* Mostrar título al pasar el cursor */
}

.sidebar-nav .sidebar-menu {
  list-style: none;
  padding: 0;
  display: none; /* Oculta los enlaces por defecto */
}

.sidebar:hover .sidebar-nav .sidebar-menu {
  display: block; /* Mostrar enlaces al pasar el cursor */
}

.sidebar-item {
  margin-bottom: 15px;
}

.sidebar-link {
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: block;
}

.sidebar-link:hover {
  text-decoration: underline;
  color: #ffd700;
}
</style>
