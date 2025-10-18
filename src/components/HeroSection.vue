<template>
  <section
    id="hero"
    class="relative min-h-[90vh] lg:min-h-screen overflow-hidden flex items-center justify-center"
  >
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
              :alt="`Laundry background ${index + 1}`"
              class="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-gradient-to-br from-navy-blue/95 via-navy-blue/80 to-navy-blue/60"
            ></div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="relative z-10 px-4 sm:px-6 md:px-8 w-full">
      <div
        class="max-w-4xl mx-auto text-center text-white flex flex-col items-center justify-center py-24 sm:py-32 md:py-40 animate-fade-in"
      >
        <div
          class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-pure-gold/50 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
        >
          <span class="w-2 h-2 bg-pure-gold rounded-full animate-pulse"></span>
          <span
            class="text-white text-xs sm:text-sm font-semibold tracking-widest uppercase"
          >
            PREMIUM LAUNDRY SERVICE
          </span>
        </div>

        <h1
          class="font-extrabold mb-5 sm:mb-7 leading-snug font-display text-[clamp(2.5rem,6vw,4.5rem)] max-w-4xl"
        >
          Laundry that's not just clean but
          <span class="text-pure-gold drop-shadow-lg">cared for</span>
        </h1>

        <p
          class="mb-6 sm:mb-8 leading-relaxed text-bone-white/80 font-medium text-[clamp(1.1rem,2vw,1.4rem)] max-w-3xl"
        >
          Premium wash, crisp press, and reliable pickup & delivery in Awka.
        </p>

        <p
          class="text-sm sm:text-base text-gray-300 mb-8 sm:mb-10 max-w-xl leading-relaxed"
        >
          48-hour standard turnaround. Express service available with a small
          surcharge.
        </p>

      
        <base-button
         
          class="inline-block bg-pure-gold text-navy-blue font-bold rounded-xl py-3.5 sm:py-4 px-10 sm:px-14 text-[clamp(1rem,1.8vw,1.15rem)] hover:bg-gradient-to-r hover:from-pure-gold hover:to-golden-brown transition-all duration-300 transform hover:scale-[1.03] shadow-xl shadow-pure-gold/40 hover:shadow-2xl hover:shadow-pure-gold/50"
        >
        Book Pickup Now 
        </base-button>

        <div
          class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 sm:mt-10"
        >
          <div class="flex items-center gap-2">
            <font-awesome-icon
              icon="star"
              class="text-pure-gold text-sm sm:text-base"
            />
            <span class="text-white font-semibold text-xs sm:text-sm">
              500+ Happy Customers
            </span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon
              icon="clock"
              class="text-pure-gold text-sm sm:text-base"
            />
            <span class="text-white font-semibold text-xs sm:text-sm">
              Same-Day Available
            </span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon
              icon="shield-alt"
              class="text-pure-gold text-sm sm:text-base"
            />
            <span class="text-white font-semibold text-xs sm:text-sm">
              100% Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div
    class="relative z-30 -mt-12 sm:-mt-16 md:-mt-20 px-4 sm:px-6 md:px-8 pb-16 sm:pb-20 md:pb-24"
  >
    <div
      class="max-w-7xl xl:max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
    >
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="bg-white rounded-2xl p-6 sm:p-7 flex flex-col items-start gap-4 border border-golden-brown/30"
      >
        <div
          class="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center"
          :class="feature.iconBg"
        >
          <font-awesome-icon
            :icon="feature.icon"
            class="text-white text-xl sm:text-2xl"
          />
        </div>
        <div class="flex-1 text-left">
          <h3 class="font-extrabold text-lg sm:text-xl mb-1 text-charcoal">
            {{ feature.title }}
          </h3>
          <p class="text-navy-blue/80 text-sm sm:text-base leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";
import BaseButton from "@/components/atoms/BaseButton.vue";
import "swiper/css";
import "swiper/css/effect-fade";

// ... (Rest of your script is unchanged) ...
const modules = [Autoplay, EffectFade];

import image1 from "@/assets/images/laundryImages/laundry-25.jpeg";
import image2 from "@/assets/images/laundryImages/laundry-17.jpg";
import image3 from "@/assets/images/laundryImages/laundry-20.jpg";
import image4 from "@/assets/images/laundryImages/laundry-22.jpg";
import image5 from "@/assets/images/laundryImages/laundry-23.jpg";
import image6 from "@/assets/images/laundryImages/laundry-2.webp";

const backgroundImages = [image1, image2, image3, image4, image5, image6];

const features = [
  {
    title: "Quality & Service",
    description: "Impeccable cleaning and care for every customer.",
    icon: "medal",
    iconBg: "bg-gradient-to-br from-pure-gold to-golden-brown",
  },
  {
    title: "Fast Delivery",
    description: "Lightning-fast pickup and return so you never wait long.",
    icon: "bolt",
    iconBg: "bg-gradient-to-br from-golden-brown to-orange-600",
  },
  {
    title: "Eco-Friendly & Gentle",
    description: "Products that protect your clothes — and the planet.",
    icon: "leaf",
    iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
];
</script>

<style scoped>
/* ... (Keep your existing styles for swiper and animation) ... */
.swiper-background {
  z-index: 1 !important;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

/* Ensure all interactive elements have a smooth transition */
button,
a,
div.hover\:shadow-2xl {
  transition: all 0.3s ease-in-out;
}
</style>
