<template>
  <section class="relative py-16 md:py-24 bg-black text-white overflow-hidden">
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: '0.3',
      }"
    ></div>

    <div class="relative z-10 container mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center md:text-left"
      >
        What our clients are saying
      </h2>
      <p
        class="text-lg md:text-xl text-white/70 mb-16 max-w-2xl text-center md:text-left mx-auto md:mx-0"
      >
        We've worked with a variety of businesses and individuals who trust us to deliver exceptional products, websites, and experiences.
      </p>

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
            pagination: false, // Disable dots on larger screens
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            pagination: false, // Disable dots on larger screens
          },
        }"
        class="pb-10 md:pb-0"
      >
        <swiper-slide v-for="(review, index) in reviews" :key="index">
          <div
            class="bg-white/10 p-6 rounded-lg h-full flex flex-col justify-between"
          >
            <div>
              <p class="text-2xl font-semibold mb-4 text-golden-brown">
                "{{ review.tag }}"
              </p>
              <p class="text-white/90 text-sm leading-relaxed mb-6">
                {{ review.text }}
              </p>
            </div>
            <div class="flex items-center mt-auto">
              <img
                :src="review.avatar"
                alt="Reviewer Avatar"
                class="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p class="font-semibold text-white">{{ review.author }}</p>
                <p class="text-white/70 text-sm">{{ review.title }}</p>
              </div>
            </div>
          </div>
        </swiper-slide>

        <div
          class="hidden md:block swiper-button-prev !text-white !-left-12"
        ></div>
        <div
          class="hidden md:block swiper-button-next !text-white !-right-12"
        ></div>

        <div class="swiper-pagination !static mt-6 md:hidden"></div>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
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
    tag: "Extraordinary",
    text: "Jeremy has been instrumental in helping CompanyName grow. The product we have released to our customers is helping us to maintain a high rate of growth as we push the platform into new territories.",
    author: "Adrian Auditore",
    title: "CoFounder, Day app",
    avatar: avatar1,
  },
  {
    tag: "Spectacular",
    text: "Reliable, hard-working, empathetic, incredibly skilled at what all he does, understanding his craft at a level I've rarely seen. I've met, and I've met 1000's of people in his profession over the last 10 years. Jeremy was very consultative, available whenever we needed him, clear in his communication and fast in his responses. He is a 12/10 I would highly recommend, so glad to be connected with him. Very happy with the end result he delivered.",
    author: "Adrian Auditore",
    title: "CoFounder, Day app",
    avatar: avatar2,
  },

  {
    tag: "Brilliant",
    text: "Working with this team was a game-changer for our business. Their insights transformed our user experience and significantly boosted engagement. Truly a pleasure!",
    author: "Chris Johnson",
    title: "CEO, Tech Solutions",
    avatar: avatar1, // Reusing avatars for example
  },
  {
    tag: "Incredible",
    text: "The dedication and talent displayed by this agency are unparalleled. They delivered beyond expectations, and we are thrilled with the outcome of our new website.",
    author: "Maria Garcia",
    title: "Marketing Director, Global Corp",
    avatar: avatar2,
  },
];
</script>

<style scoped>

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
