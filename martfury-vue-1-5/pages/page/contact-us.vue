<template lang="html">
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">Tiendas</li>
      </ol>
    </nav>

    <h1 class="title">Tiendas</h1>
    <div class="tiendas-container">
      <div class="tienda-card" v-for="tienda in tiendas" :key="tienda.IdTienda">
        <div class="tienda-info">
          <h2 class="tienda-nombre">{{ tienda.Nombre }}</h2>
          <p class="tienda-direccion">{{ tienda.Direccion }}</p>
          <p class="tienda-coordenadas">
            Latitud: {{ tienda.Latitud }}, Longitud: {{ tienda.Longitud }}
          </p>
        </div>
      </div>
    </div>

    <div class="closest-store-button-container">
      <button @click="findClosestStore" class="closest-store-button">Buscar Tienda Más Cercana</button>
    </div>

    <div class="closest-store-container" v-if="closestStore">
      <h2 class="closest-title">Tienda Más Cercana</h2>
      <div class="closest-store-info">
        <h3>{{ closestStore.Nombre }}</h3>
        <p>Dirección: {{ closestStore.Direccion }}</p>
        <p>Distancia: {{ closestStore.distance.toFixed(2) }} km</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tiendas: [],
      closestStore: null,
      clientLocation: null,
      breadCrumb: [
        {
          text: "Home",
          url: "/"
        },
        {
          text: "Tiendas"
        }
      ]
    };
  },
  mounted() {
    this.getTiendas();
  },
  methods: {
    getTiendas() {
      return axios
        .get("http://137.184.244.147/api/tienda")
        .then((response) => {
          this.tiendas = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async findClosestStore() {
      try {
        await this.getClientLocation();
        this.calculateClosestStore();
      } catch (error) {
        console.error("Error al obtener la tienda más cercana:", error);
      }
    },
    getClientLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.clientLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            resolve();
          },
          (error) => {
            console.error("Error al obtener la ubicación del cliente:", error);
            reject(error);
          }
        );
      });
    },
    calculateClosestStore() {
      if (!this.clientLocation || !this.tiendas.length) return;

      this.tiendas.forEach((tienda) => {
        const distance = this.calculateDistance(
          this.clientLocation.latitude,
          this.clientLocation.longitude,
          tienda.Latitud,
          tienda.Longitud
        );
        tienda.distance = distance;
      });

      this.closestStore = this.tiendas.reduce((closest, tienda) =>
        tienda.distance < closest.distance ? tienda : closest
      );
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  }
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

.tiendas-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tienda-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin: 15px;
  padding: 20px;
  width: calc(33.33% - 30px);
  transition: transform 0.2s;
}

.tienda-card:hover {
  transform: scale(1.02);
}

.tienda-info {
  text-align: center;
}

.tienda-nombre {
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
}

.tienda-direccion,
.tienda-coordenadas {
  font-size: 14px;
  color: #555;
}

.closest-store-button-container {
  text-align: center;
  margin-top: 20px;
}

.closest-store-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.closest-store-button:hover {
  background-color: #45a049;
}

.closest-store-container {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.closest-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.closest-store-info h3 {
  font-size: 18px;
  font-weight: 600;
}

.closest-store-info p {
  font-size: 14px;
  color: #555;
}

/* Media Queries */
@media (max-width: 992px) {
  .tienda-card {
    width: calc(50% - 30px);
  }

  .title {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .tienda-card {
    width: 100%;
  }

  .title {
    font-size: 24px;
  }

  .closest-store-button {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 20px;
  }

  .tienda-direccion,
  .tienda-coordenadas,
  .closest-store-info p {
    font-size: 12px;
  }
}
</style>
