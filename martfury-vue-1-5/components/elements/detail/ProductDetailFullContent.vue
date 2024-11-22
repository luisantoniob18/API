<template lang="html">
    <div class="ps-product--detail ps-product--full-content">
        <div class="ps-product__top">
            <div class="ps-product__header">
                <thumbnail-count-down :product="product" />
                <information-full-content :product="product" />
            </div>
            <div class="ps-product__price-right">
                <h4
                    v-if="product.is_sale"
                    class="ps-product__price sale"
                >
                    <del class="mr-2">${{ product.sale_price }}</del>
                    ${{ product.price }}
                </h4>
                <h4 v-else class="ps-product__price">${{ product.price }}</h4>
                <div class="ps-product__shopping">
                    <figure>
                        <figcaption>Quantity</figcaption>
                        <div class="form-group--number">
                            <button @click="increaseQuantity" class="up">+</button>
                            <button @click="decreaseQuantity" class="down">-</button>
                            <input
                                class="form-control"
                                type="text"
                                v-model="quantity"
                                placeholder="1"
                            />
                        </div>
                    </figure>
                    <a class="ps-btn ps-btn--gray" @click="addToCart">
                        Add to cart
                    </a>
                    <a class="ps-btn" @click="buyNow">
                        Buy Now
                    </a>
                    <div class="ps-product__actions">
                        <a href="#">
                            <i class="icon-heart mr-2"></i>
                            Add to wishlist
                        </a>
                        <a href="#">
                            <i class="icon-chart-bars mr-2"></i>
                            Compare
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <description-full-content />
    </div>
</template>

<script>
import { extended } from '~/static/data/product'; 
import DefaultDescription from '~/components/elements/detail/modules/DefaultDescription';
import ThumbnailCountDown from '~/components/elements/detail/thumbnail/ThumbnailCountDown';
import InformationExtended from '~/components/elements/detail/information/InformationExtended';
import InformationFullContent from '~/components/elements/detail/information/InformationFullContent';
import DescriptionFullContent from '~/components/elements/detail/modules/DescriptionFullContent';

export default {
    name: 'ProductDetailFullContent',
    components: {
        DescriptionFullContent,
        InformationFullContent,
        InformationExtended,
        ThumbnailCountDown,
        DefaultDescription
    },
    data() {
        return {
            quantity: 1, 
        };
    },
    props: {
        product: {
            type: Object,
            required: true 
        }
    },
    methods: {
        increaseQuantity() {
            this.quantity += 1; 
        },
        decreaseQuantity() {
            if (this.quantity > 1) this.quantity -= 1; 
        },
        addToCart() {
            // Lógica para agregar al carrito
            this.$store.commit('cart/addItem', { ...this.product, quantity: this.quantity });
            this.$notify({
                group: 'cartAddItem',
                title: 'Added to Cart',
                text: `${this.product.name} has been added to your cart!`
            });
        },
        buyNow() {
            
            this.addToCart();
            
        }
    },
    computed: {
        
        product() {
            return extended; 
        }
    }
};
</script>

<style lang="scss" scoped>
/* Estilos si son necesarios */
</style>
