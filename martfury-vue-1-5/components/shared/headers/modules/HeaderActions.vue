<template lang="html">
    <div class="header__actions">
        <mini-cart />
        <header-user-area />
    </div>
</template>

<script>
import MiniCart from './MiniCart';
import { mapState } from 'vuex';
import HeaderUserArea from '~/components/shared/headers/modules/HeaderUserArea';
export default {
    name: 'HeaderActions',
    components: { HeaderUserArea, MiniCart },
    computed: {
        ...mapState({
            total: state => state.cart.total,
            wishlistTotal: state => state.wishlist.total,
            compareTotal: state => state.compare.total
        })
    }
};
</script>

<style lang="scss" scoped></style>
