<template lang="html">
    <div class="navigation__right">
        <!-- Contenedor del carrito -->
        <div class="ps-cart--mini">
            <!-- Ícono del carrito -->
            <a class="header__extra" href="#">
                <i class="icon-bag2"></i>
                <span class="cart-counter">
                    <i>{{ total }}</i>
                </span>
            </a>

            <!-- Contenido del carrito -->
            <div v-if="total > 0" class="ps-cart__content">
                <div class="ps-cart__footer">
                    <h3>
                        {{ $t('header.miniCart.subTotal') }}
                        <strong>Q{{ amount }}</strong>
                    </h3>
                    <figure>
                        <div>
                            <nuxt-link to="/ventas/carrocompras" class="ps-btn">
                                {{ $t('Ver Carrito') }}
                            </nuxt-link>
                        </div>
                    </figure>
                </div>
            </div>
            <div v-else class="ps-cart__content">
                <div class="ps-cart__items no-products">
                    {{ $t('No hay productos en el carrito') }}
                </div>
            </div>
        </div>

        <!-- Ícono de usuario -->
        <div class="ps-user--mini">
            <div v-if="!isLoggedIn">
                <nuxt-link class="header__extra" to="/account/login">
                    <i class="icon-user"></i>
                </nuxt-link>
            </div>
            <div v-else>
                <div class="header__extra" @click="toggleUserMenu">
                    <i class="icon-user"></i>
                </div>
                <!-- Contenido del usuario (Logout) -->
                <div v-show="isUserMenuOpen" class="ps-user__content">
                    <span>{{ nombre }} {{ apellido }}</span>
                    <a href="#" @click.prevent="handleLogout" class="logout-link">
                        Logout
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'HeaderUserArea',
    data() {
        return {
            isUserMenuOpen: false, // Controla la visibilidad del menú de usuario
        };
    },
    computed: {
        ...mapState({
            total: state => state.cart.total, // Número total de ítems en el carrito
            amount: state => state.cart.amount, // Monto total en el carrito
            isLoggedIn: state => state.auth.isLoggedIn, // Estado de autenticación
            nombre: state => state.auth.nombre, // Nombre del usuario autenticado
            apellido: state => state.auth.apellido, // Apellido del usuario autenticado
        }),
    },
    methods: {
        toggleUserMenu() {
            this.isUserMenuOpen = !this.isUserMenuOpen; // Alterna la visibilidad del menú de usuario
        },
        handleLogout() {
            this.$store.dispatch('auth/logout'); // Limpia el estado de autenticación
            this.$router.push('/account/login'); // Redirige al login
        },
    },
};
</script>

<style lang="scss" scoped>
/* Contenedor principal de los íconos */
.navigation__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px; /* Espacio entre íconos */
}

/* Contenedor del carrito y usuario */
.header__extra {
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-size: 18px; /* Tamaño uniforme para ambos íconos */
    color: #333;
}

/* Contador del carrito: círculo negro con texto blanco en la esquina inferior derecha */
.cart-counter {
    font-size: 12px;
    background-color: black;
    color: white;
    border-radius: 50%;
    padding: 3px 6px;
    position: absolute;
    bottom: -5px; /* Ajusta el contador a la esquina inferior derecha */
    right: -5px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 18px;
    height: 18px;
    line-height: 1;
}

/* Menú desplegable del usuario */
.ps-user__content {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 15px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ps-user__content span {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

/* Logout */
.logout-link {
    color: red;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
}

.logout-link:hover {
    text-decoration: underline;
}
</style>
