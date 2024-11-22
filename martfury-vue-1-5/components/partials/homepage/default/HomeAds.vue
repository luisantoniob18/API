<template lang="html">
    <div class="ps-home-ads">
        <div class="ps-container">
            <div class="row">
                <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 ">
                    
                        <a class="ps-collection">
                            <img
                                src="/img/slider/home-1/r3.jpg" height="500"
                                alt="martfury"
                            />
                        </a>
                    
                </div>
                <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 ">
                    
                        <a class="ps-collection">
                            <img
                                src="/img/slider/home-1/r2.jpg" width="100" height="500"
                                alt="martfury"
                            />
                        </a>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeAds'
};
</script>

<style lang="scss" scoped>

.ps-home-ads {
    padding: 20px 0;

    .ps-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 15px;
    }

    .row {
        display: flex;
        gap: 20px; 
        flex-wrap: wrap; 

        .col-xl-8,
        .col-lg-8,
        .col-md-12,
        .col-sm-12,
        .col-12 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1 1 50%;
        }

        .col-xl-8 {
            flex: 1 1 70%; 
        }

        .col-xl-4 {
            flex: 1 1 30%; 
        }

        a.ps-collection {
            display: block;
            width: 100%; 
            height: 100%; 
            img {
                width: 100%;
                height: 100%; 
                object-fit: cover; 
                border-radius: 10px; 
            }
        }

        @media (max-width: 768px) {
            .col-xl-8,
            .col-lg-8,
            .col-md-12,
            .col-sm-12,
            .col-12 {
                flex: 1 1 100%; 
            }
        }
    }
}

</style>