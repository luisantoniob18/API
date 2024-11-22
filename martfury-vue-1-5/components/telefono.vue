<template>
    <div>
      <!-- Barra lateral (visible solo en pantallas pequeñas) -->
      <aside v-if="isSmallScreen && sidebarVisible" class="sidebar">
        <button class="close-button" @click="toggleSidebar">✖</button>
        <ul class="sidebar-menu">
          <li>
            <!-- Usar nuxt-link para navegación interna -->
            <nuxt-link to="/ger/productos" @click.native="toggleSidebar">PRUEBA</nuxt-link>
          </li>
        </ul>
      </aside>
  
      <!-- Botón para abrir la barra lateral -->
      <button
        v-if="isSmallScreen && !sidebarVisible"
        class="open-button"
        @click="toggleSidebar"
      >
        ☰
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
    data() {
      return {
        isSmallScreen: false, // Detecta si la pantalla es pequeña
        sidebarVisible: true, // Controla la visibilidad de la barra lateral
      };
    },
    mounted() {
      this.checkScreenSize(); // Verifica el tamaño de la pantalla al montar
      window.addEventListener("resize", this.checkScreenSize); // Detecta cambios en el tamaño de la ventana
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.checkScreenSize); // Limpia el evento
    },
    methods: {
      toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible; // Alterna la visibilidad de la barra lateral
      },
      checkScreenSize() {
        this.isSmallScreen = window.innerWidth <= 768; // Actualiza el estado de isSmallScreen según el tamaño
        if (!this.isSmallScreen) {
          this.sidebarVisible = false; // Asegura que la barra lateral esté oculta en pantallas grandes
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Barra lateral */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    background-color: #333;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    z-index: 1000;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-menu li {
    margin-bottom: 15px;
  }
  
  .sidebar-menu li a,
  .sidebar-menu li nuxt-link {
    color: white;
    text-decoration: none;
    font-size: 18px;
  }
  
  .sidebar-menu li a:hover,
  .sidebar-menu li nuxt-link:hover {
    text-decoration: underline;
  }
  
  /* Botón para cerrar la barra lateral */
  .close-button {
    align-self: flex-end;
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  /* Botón para abrir la barra lateral */
  .open-button {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
  }
  
  .open-button:hover {
    background: #0056b3;
  }
  
  /* Media query: Ocultar barra lateral y botones en pantallas grandes */
  @media (min-width: 769px) {
    .sidebar,
    .open-button {
      display: none !important;
    }
  }
  </style>
  