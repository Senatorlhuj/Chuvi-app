<template>
  <section
    id="testimonials"
    class="relative py-24 bg-black text-white overflow-hidden"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0.25',
      }"
    ></div>

    <div class="relative z-10 container mx-auto px-6">
      <!-- Header -->
      <div
        id="testimonial-header"
        data-animate
        :class="isVisible['testimonial-header'] ? 'visible' : ''"
        class="text-center mb-16"
      >
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          TESTIMONIALS & REVIEWS
        </h2>
        <p
          class="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          What Real Customers Say
        </p>
      </div>

      <!-- Carousel -->
      <div
        id="testimonial-carousel"
        data-animate
        :class="isVisible['testimonial-carousel'] ? 'visible' : ''"
      >
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="30"
          :loop="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false,
          }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :pagination="{
            clickable: true,
            el: '.swiper-pagination',
          }"
          :breakpoints="{
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
              pagination: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
              pagination: false,
            },
          }"
          class="pb-10 md:pb-0"
        >
          <swiper-slide
            v-for="(review, index) in reviews"
            :key="index"
            class="transition-all duration-500"
          >
            <div
              class="bg-white/10 backdrop-blur-sm p-6 rounded-2xl h-full flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <p class="text-white/90 text-sm leading-relaxed mb-6 italic">
                “{{ review.text }}”
              </p>
              <div class="flex items-center mt-auto">
                <img
                  :src="review.avatar"
                  alt="Reviewer Avatar"
                  class="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p class="font-semibold text-pure-gold">
                    {{ review.author }}
                  </p>
                  <p class="text-white/70 text-sm">{{ review.location }}</p>
                </div>
              </div>
            </div>
          </swiper-slide>

          <!-- Navigation & Pagination -->
          <div
            class="hidden md:block swiper-button-prev !text-white !-left-12"
          ></div>
          <div
            class="hidden md:block swiper-button-next !text-white !-right-12"
          ></div>
          <div class="swiper-pagination !static mt-6 md:hidden"></div>
        </swiper>
      </div>

      <!-- CTA -->
      <div
        id="testimonial-cta"
        data-animate
        :class="isVisible['testimonial-cta'] ? 'visible' : ''"
        class="text-center mt-16"
      >
        <p class="text-lg text-white/80 mb-6">
          Join <span class="text-pure-gold font-semibold">800+</span> satisfied
          customers across Agulu.
        </p>
     
        <base-button 
         class="bg-pure-gold text-navy-blue py-3 px-10 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
        >
       Experience CHUVI Care
      </base-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import BaseButton from "@/components/atoms/BaseButton.vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Autoplay, Navigation, Pagination];

import backgroundImage from "@/assets/images/review-section-background.jpeg";
import avatar1 from "@/assets/images/avatars/avatar1.jpg";
import avatar2 from "@/assets/images/avatars/avatar2.JPG";

const reviews = [
  {
    text: "Clothes look new every time. Pickup was on time—again.",
    author: "Ifeanyi",
    location: "UNIZIK environs",
    avatar: avatar1,
  },
  {
    text: "Pressed perfectly, delivered early before my meeting.",
    author: "Amaka",
    location: "Aroma",
    avatar: avatar2,
  },
  {
    text: "Best native wear care I’ve used in Awka.",
    author: "Chinedu",
    location: "Ifite",
    avatar: avatar2,
  },
];

// Reuse the same IntersectionObserver reveal logic as About section
const isVisible = ref({});

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value[entry.target.id] = true;
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });

  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}

/* Swiper controls */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  display: none !important;
}

@media (min-width: 768px) {
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    display: flex !important;
    font-size: 2rem !important;
    width: 40px !important;
    height: 40px !important;
    color: #fff !important;
  }
}

:deep(.swiper-pagination-bullet) {
  width: 12px !important;
  height: 12px !important;
  border-radius: 50% !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  opacity: 1 !important;
  margin: 0 4px !important;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #b6862c !important;
}

:deep(.swiper-pagination) {
  display: block !important;
}
</style>
