<template lang="html">
    <main id="homepage-1">
        <home-banner/>
        <site-feautures-fullwidth/>
        <home-default-deal-of-day
            v-if="collections !== null"
            collection-slug="deal-of-the-day"
        />
        
        
        <template v-if="collections !== null">
            <conumer-electronics collection-slug="consumer-electronics"/>
        </template>
        <home-ads/>
        </main>
</template>
<script>
import { mapState } from 'vuex';
import SiteFeauturesFullwidth from '~/components/partials/commons/SiteFeauturesFullwidth';
import HomeAdsColumns from '~/components/partials/homepage/default/HomeAdsColumns';
import HomeAds from '~/components/partials/homepage/default/HomeAds';
import HomeDefaultTopCategories from '~/components/partials/homepage/default/HomeDefaultTopCategories';
import ConumerElectronics from '~/components/partials/homepage/default/ConumerElectronics';
import HomeBanner from '~/components/partials/homepage/default/HomeBanner';
import '@fortawesome/fontawesome-free/css/all.css';



export default {
    transition: 'zoom',
    layout: 'layout-default',
    components: {
        HomeBanner,
        HomeAdsColumns,
        SiteFeauturesFullwidth,
        HomeAds,
        HomeDefaultTopCategories,
        ConumerElectronics
    },

    computed: {
        ...mapState({
            collections: state => state.collection.collections
        })
    },

    async created() {
        const queries = [
            'deal-of-the-day',
            'consumer-electronics',
            'clothings',
            'garden-and-kitchen',
            'new-arrivals-products'
        ];
        await this.$store.dispatch('collection/getCollectionsBySlugs', queries);
    }
};
</script>
