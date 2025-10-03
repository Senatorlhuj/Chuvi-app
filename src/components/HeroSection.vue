<template>
  <section class="relative h-[600px] md:h-[700px] overflow-hidden">
    <div class="absolute inset-0 w-full h-full">
      <swiper
        :modules="modules"
        effect="fade"
        :preloadImages="true"
        watchSlidesProgress
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :loop="true"
        :speed="1000"
        class="w-full h-full swiper-background"
      >
        <swiper-slide v-for="(image, index) in backgroundImages" :key="index">
          <div class="relative w-full h-full">
            <img
              :src="image"
              class="absolute inset-0 w-full h-full object-cover"
              alt="background"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"
            ></div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="hero-text-overlay">
      <div class="container mx-auto h-full flex items-center p-4 md:p-8">
        <div class="text-white max-w-2xl text-center md:text-left">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight font-display"
          >
            Laundry that’s not just clean—cared for
          </h1>
          <p class="text-lg md:text-xl mb-6 leading-relaxed">
            Premium wash, crisp press, and reliable pickup & delivery in Awka.
          </p>

          <p class="text-sm md:text-base text-gray-300 mb-6">
            48-hour standard turnaround. Express attracts a small surcharge.
            Bulky items are priced separately.
          </p>

          <div
            class="flex flex-col md:flex-row justify-center items-center md:justify-start md:items-start space-y-4 md:space-y-0 md:space-x-4"
          >


          <router-link to="/register"
          class="inline-block w-1/2 md:w-auto bg-golden-brown text-white py-4 px-8 text-lg font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
               Book pickup
          </router-link>
            
          </div>
        </div>
      </div>
    </div>
  </section>

  <div
    class="container mx-auto -mt-20 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-6 p-4"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 flex items-start space-x-4 hover:shadow-2xl transition-shadow duration-300 feature-box"
    >
      <font-awesome-icon
        icon="medal"
        class="text-pure-gold text-3xl mt-1 flex-shrink-0"
      />
      <div>
        <h3 class="font-bold text-lg mb-2">Quality & Service</h3>
        <p class="text-navy-blue text-sm leading-relaxed">
          Impeccable cleaning and care for every customer
        </p>
      </div>
    </div>
    <div
      class="bg-white rounded-lg shadow-xl p-6 flex items-start space-x-4 hover:shadow-2xl transition-shadow duration-300 feature-box"
    >
      <font-awesome-icon
        icon="bolt"
        class="text-golden-brown text-3xl mt-1 flex-shrink-0"
      />
      <div>
        <h3 class="font-bold text-lg mb-2">Fast Delivery</h3>
        <p class="text-navy-blue text-sm leading-relaxed">
          Enjoy lightning-quick pickup and return of your clothes so you can get
          back to your day without delays.
        </p>
      </div>
    </div>
    <div
      class="bg-white rounded-lg shadow-xl p-6 flex items-start space-x-4 hover:shadow-2xl transition-shadow duration-300 feature-box"
    >
      <font-awesome-icon
        icon="leaf"
        class="text-charcoal text-3xl mt-1 flex-shrink-0"
      />
      <div>
        <h3 class="font-bold text-lg mb-2">Eco-Friendly & Gentle</h3>
        <p class="text-navy-blue text-sm leading-relaxed">
          We use products that protect your clothes
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const modules = [Autoplay, EffectFade];

import image1 from "@/assets/images/laundryImages/laundry-25.jpeg";
import image2 from "@/assets/images/laundryImages/laundry-17.jpg";
import image3 from "@/assets/images/laundryImages/laundry-20.jpg";
import image4 from "@/assets/images/laundryImages/laundry-22.jpg";
import image5 from "@/assets/images/laundryImages/laundry-23.jpg";
import image6 from "@/assets/images/laundryImages/laundry-2.webp";

const backgroundImages = [image1, image2, image3, image4, image5, image6];
</script>

<style scoped>
/* Reset swiper z-index to ensure background stays behind */
.swiper-background {
  z-index: 1 !important;
}

.swiper-background .swiper-wrapper,
.swiper-background .swiper-slide {
  z-index: 1 !important;
}

/* Text overlay - lower z-index than header */
.hero-text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10 !important;
  pointer-events: none; /* Allow clicks to pass through to buttons */
}

.hero-text-overlay > div {
  pointer-events: auto; /* Re-enable pointer events for content */
}

/* Ensure button is clickable but doesn't interfere with header */
.hero-text-overlay button,
.hero-text-overlay a {
  position: relative;
  z-index: 15; /* Lower than header's z-50 */
}

/* Feature boxes enhancement */
.feature-box {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-box:hover {
  transform: translateY(-5px);
}

/* Ensure hero section doesn't create stacking context issues */
section {
  z-index: auto;
}
</style>
