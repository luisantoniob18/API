<template>
    <header class="header header--mobile">
        <div class="header__top">
            <div class="header__left">
                <p>Welcome to Martfury Online Shopping Store!</p>
            </div>
            <div class="header__right">
                <ul class="navigation__extra">
                    <li>
                        <nuxt-link to="/vendor/become-a-vendor">Sell on Martfury</nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="/account/order-tracking">Track your order</nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="navigation--mobile">
            <div class="navigation__left">
                <div class="menu-container">
                    <button @click="toggleMenu" class="menu-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" />
                        </svg>
                    </button>
                    <div v-if="menuVisible" class="menu-dropdown">
                        <!-- Categorías -->
                        <div class="menu--product-categories">
                            <div class="menu__toggle">
                                <i class="icon-menu"></i>
                                <span> {{ $t('header.shopByDepartment') }}</span>
                            </div>
                            <div class="menu__content">
                                <menu-categories />
                            </div>
                        </div>
                        <!-- Menú principal -->
                        <div class="navigation__center">
                            <menu-default />
                        </div>
                    </div>
                </div>
                <nuxt-link to="/" class="ps-logo">
                    <img src="~/static/img/logo_light.png" alt="martfury" />
                </nuxt-link>
            </div>
            <mobile-header-actions />
        </div>
    </header>
</template>

<script>
import MobileHeaderActions from '~/components/shared/mobile/modules/MobileHeaderActions';
import MenuCategories from '~/components/shared/menu/MenuCategories';
import MenuDefault from '~/components/shared/menu/MenuDefault';

export default {
    name: 'HeaderMobile',
    components: {
        MobileHeaderActions,
        MenuCategories,
        MenuDefault,
    },
    data() {
        return {
            menuVisible: false,
        };
    },
    methods: {
        toggleMenu() {
            this.menuVisible = !this.menuVisible;
        },
    },
};
</script>

<style scoped>
.menu-container {
    position: relative;

    .menu-button {
        background: none;
        border: none;
        cursor: pointer;

        svg {
            fill: none;
            stroke: #333;
            stroke-width: 2;
            width: 24px;
            height: 24px;
        }
    }

    .menu-dropdown {
        position: absolute;
        top: 40px;
        left: 0;
        background: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 10px;
        z-index: 1000;
    }

    .menu--product-categories {
        margin-bottom: 20px;

        .menu__toggle {
            display: flex;
            align-items: center;
            cursor: pointer;
            i {
                margin-right: 8px;
            }
        }

        .menu__content {
            margin-top: 10px;
        }
    }

    .navigation__center {
        display: flex;
        justify-content: center;
    }
}
</style>
