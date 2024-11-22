<template lang="html">
  <div class="container">
      <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Acerca de Nosotros</li>
          </ol>
      </nav>

      <h1 class="title">Acerca de Nosotros</h1>
      <div class="cuadros-container">
          <div class="cuadro-card">
              <div class="cuadro-info">
                  <h2 class="cuadro-titulo">Nuestra Historia</h2>
                  <p class="cuadro-descripcion">
                      Contamos con una larga trayectoria en el mercado, proporcionando productos de calidad y compromiso con nuestros clientes.
                  </p>
              </div>
          </div>
          <div class="cuadro-card">
              <div class="cuadro-info">
                  <h2 class="cuadro-titulo">Nuestro Equipo</h2>
                  <p class="cuadro-descripcion">
                      Un equipo altamente capacitado que trabaja día a día para ofrecer el mejor servicio y satisfacer las necesidades de nuestros clientes.
                  </p>
              </div>
          </div>
          <div class="cuadro-card">
              <div class="cuadro-info">
                  <h2 class="cuadro-titulo">Nuestros Dueños</h2>
                  <p class="cuadro-descripcion">
                      Este proyecto es dirigido por Eduardo Alvarez y Luis Baquiax, quienes están comprometidos con la calidad y la satisfacción de nuestros clientes.
                  </p>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
          breadCrumb: [
              {
                  text: 'Home',
                  url: '/',
              },
              {
                  text: 'Acerca de Nosotros',
              },
          ],
      };
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.breadcrumb {
  background-color: transparent;
  padding: 10px 0;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.cuadros-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.cuadro-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin: 15px;
  padding: 20px;
  width: calc(33.33% - 40px); /* Tres columnas por defecto */
  transition: transform 0.2s;
}

.cuadro-card:hover {
  transform: scale(1.02);
}

.cuadro-info {
  text-align: center;
}

.cuadro-titulo {
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
}

.cuadro-descripcion {
  font-size: 16px;
  color: #555;
}

/* Estilos responsivos */
@media (max-width: 992px) {
  .cuadro-card {
      width: calc(50% - 30px); /* Dos columnas en pantallas medianas */
  }

  .title {
      font-size: 28px;
  }
}

@media (max-width: 768px) {
  .cuadro-card {
      width: calc(100% - 30px); /* Una columna en pantallas pequeñas */
  }

  .title {
      font-size: 24px;
  }

  .breadcrumb {
      font-size: 14px;
  }
}

@media (max-width: 576px) {
  .container {
      padding: 15px;
  }

  .title {
      font-size: 20px;
  }

  .cuadro-descripcion {
      font-size: 14px;
  }
}
</style>
