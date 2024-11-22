<template>
    <div v-if="isAuthorized">
      <Reporte1 />
      <Reporte2 />
      <Reporte3 />
      <Reporte4 />
      <Reporte5 />
      <reporte6/>
      <Reporte7/>
    </div>
  </template>
  
  <script>
  import Reporte1 from "@/components/reportes/reporte1.vue"; 
  import Reporte2 from "@/components/reportes/reporte2.vue"; 
  import Reporte3 from "@/components/reportes/reporte3.vue"; 
  import Reporte4 from "@/components/reportes/reporte4.vue"; 
  import Reporte5 from "@/components/reportes/reporte5.vue"; 
  import Reporte6 from "@/components/reportes/reporte6.vue"; 
  import Reporte7 from "@/components/reportes/reporte7.vue"; 
  
  export default {
    name: "Reportes",
    components: {
      Reporte1,
      Reporte2,
      Reporte3,
      Reporte4, 
      Reporte5,
      Reporte6,
      Reporte7,
    },
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
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  