<template lang="html">
    <div class="ps-home-banner ps-home-banner--1">
      <div class="ps-container">
        <div class="ps-section__left">
          <div class="ps-carousel" v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div
                  class="ps-banner bg--cover"
                  :style="{
                    backgroundImage: `url(/img/slider/home-1/s.jpeg)`
                  }"
                ></div>
              </div>
              <div class="swiper-slide">
                <div
                  class="ps-banner bg--cover"
                  :style="{
                    backgroundImage: `url(/img/slider/home-1/x.jpg)`
                  }"
                ></div>
              </div>
              <div class="swiper-slide">
                <div
                  class="ps-banner bg--cover"
                  :style="{
                    backgroundImage: `url(/img/slider/home-1/e.jpeg)`
                  }"
                ></div>
              </div>
            </div>
            <!-- Carousel controls -->
            <div class="swiper-nav">
              <span class="swiper-arrow swiper-prev">
                <i class="icon-chevron-left"></i>
              </span>
              <div class="swiper-arrow swiper-next">
                <i class="icon-chevron-right"></i>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-bullets"></div>
          </div>
        </div>
        <div class="ps-section__right">
          <div>
            <img src="/img/slider/home-1/c.jpg" alt="martfury" />
          </div>
          <div>
            <img src="/img/slider/home-1/24.png" alt="martfury" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeBanner',
    data() {
      return {
        swiperOption: {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 1,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false
          },
          speed: 1000, // Duración de la transición en milisegundos (1 segundo)
          navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev'
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        }
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .ps-home-banner {
    .ps-carousel {
      position: relative;
    }
  
    .swiper-nav {
      position: absolute;
      width: 100%;
      top: 50%;
      display: flex;
      justify-content: space-between;
      transform: translateY(-50%);
    }
  
    .swiper-pagination-bullets {
      bottom: 10px;
    }
  }
  </style>
  