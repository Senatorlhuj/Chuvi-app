<template>
  <section id="why-choose-chuvi" class="py-16 md:py-24 bg-bone-white overflow-hidden relative">
    <!-- Background Gradient Blobs -->
    <div class="absolute inset-0 overflow-hidden opacity-5">
      <div class="absolute top-0 left-0 w-72 h-72 bg-pure-gold rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-golden-brown rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Header -->
      <div ref="headerRef" class="text-center mb-16 opacity-0">
        <h2 class="text-3xl md:text-4xl font-black text-charcoal mb-4 tracking-tight">
          Why Choose <span class="text-pure-gold">Chuvi</span>
        </h2>
        <p class="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
          We treat each item like it’s ours—sorted by fabric, washed with care,
          pressed to a crisp finish, and checked before it’s packed. You’ll get
          simple booking, clear timelines, and updates you can trust.
        </p>
      </div>

      <!-- Content -->
      <div ref="contentRef" class="opacity-0">
        <!-- Mobile Swiper -->
        <div class="lg:hidden">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div
                v-for="(feature, index) in allFeatures"
                :key="index"
                class="swiper-slide  rounded-2xl overflow-hidden flex flex-col"
              >
                <div class="relative h-[200px] flex-shrink-0 rounded-2xl overflow-hidden">
                  <img :src="feature.image" :alt="feature.title" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/10"></div>
                </div>
                <div class="py-3 px-4 flex-grow flex flex-col justify-center text-center relative">
                  <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-golden-brown to-pure-gold rounded-lg flex items-center justify-center"
                    >
                      <div class="w-3 h-3 bg-bone-white rounded-sm opacity-90"></div>
                    </div>
                  </div>
                  <h3 class="text-xl font-bold text-charcoal leading-tight mt-2 mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-charcoal/70 text-base leading-relaxed font-medium">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
            <div class="swiper-pagination mt-4"></div>
          </div>
        </div>

        <!-- Desktop -->
        <div class="hidden lg:flex lg:flex-row lg:space-x-8 relative">
          <!-- Large Feature -->
          <div class="relative flex-shrink-0 lg:w-1/2 mb-10 lg:mb-0" ref="largeCardRef">
            <div
              class=" rounded-2xl overflow-hidden h-[500px]"
            >
              <div class="relative h-3/5 rounded-2xl overflow-hidden">
                <transition-group tag="div" name="slide-transition" class="absolute inset-0">
                  <div v-for="feature in activeFeature" :key="feature.image" class="absolute inset-0">
                    <img :src="feature.image" :alt="feature.title" class="w-full h-full object-cover" />
                  </div>
                </transition-group>
                <div class="absolute inset-0 bg-gradient-to-t from-navy-blue/20 to-transparent"></div>
              </div>
              <div class="p-6 relative h-2/5 flex flex-col justify-center">
                <div class="absolute -top-6 left-6">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-golden-brown to-pure-gold rounded-xl flex items-center justify-center"
                  >
                    <div class="w-6 h-6 bg-bone-white rounded-md opacity-80"></div>
                  </div>
                </div>
                <transition name="fade-up" mode="out-in">
                  <h3
                    :key="displayedFeatures.largeCard.title"
                    class="text-xl md:text-2xl font-bold text-charcoal mb-2 mt-2 leading-tight line-clamp-2"
                  >
                    {{ displayedFeatures.largeCard.title }}
                  </h3>
                </transition>
                <transition name="fade-up" mode="out-in">
                  <p
                    :key="displayedFeatures.largeCard.description"
                    class="text-charcoal/70 text-base leading-relaxed font-medium line-clamp-3"
                  >
                    {{ displayedFeatures.largeCard.description }}
                  </p>
                </transition>
              </div>
            </div>
          </div>

          <!-- Small Feature Cards -->
          <div class="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 relative" ref="smallCardsRef">
            <div
              v-for="(feature, index) in displayedFeatures.smallCards"
              :key="index"
              class=" rounded-2xl overflow-hidden h-[400px] flex flex-col"
            >
              <div class="relative h-1/2 rounded-2xl overflow-hidden">
                <transition-group tag="div" name="slide-transition" class="absolute inset-0">
                  <div class="absolute inset-0" :key="smallCardImages[index].image">
                    <img
                      :src="smallCardImages[index].image"
                      :alt="smallCardImages[index].title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </transition-group>
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/10"></div>
              </div>
              <div class="py-3 flex-grow flex flex-col justify-center text-center relative">
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-golden-brown to-pure-gold rounded-lg flex items-center justify-center"
                  >
                    <div class="w-3 h-3 bg-bone-white rounded-sm opacity-90"></div>
                  </div>
                </div>
                <transition name="fade-up" mode="out-in">
                  <h3
                    :key="feature.title"
                    class="text-xl font-bold text-charcoal leading-tight line-clamp-3 mt-2"
                  >
                    {{ feature.title }}
                  </h3>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

// --- Images ---
import solarImage from "@/assets/images/laundryImages/solar-powered.jpeg";
import tagImage from "@/assets/images/laundryImages/laundry-18.jpg";
import handSortingImage from "@/assets/images/laundryImages/hand-sorting.jpg";
import happyDeliveryImage from "@/assets/images/laundryImages/delivery-person.jpeg";

// --- Feature Data ---
const allFeatures = [
  { image: happyDeliveryImage, title: "Our Promise to You", description: "No stories—we keep our word on pickup and delivery times." },
  { image: tagImage, title: "Your Clothes Stay Yours", description: "Every item is meticulously tagged and tracked throughout the process." },
  { image: solarImage, title: "NEPA No Be Problem", description: "Solar backup keeps us running 24/7, ensuring your laundry is always on schedule." },
  { image: handSortingImage, title: "Real People, Real Care", description: "Your clothes are not just machine washed; they are properly hand-sorted with care." },
];

// --- State ---
const activeIndex = ref(0);
const desktopAutoplayInterval = ref(null);
const displayedFeatures = computed(() => {
  const largeIndex = activeIndex.value;
  return {
    largeCard: allFeatures[largeIndex],
    smallCards: [
      allFeatures[(largeIndex + 1) % allFeatures.length],
      allFeatures[(largeIndex + 2) % allFeatures.length],
    ],
  };
});
const smallCardImages = computed(() => [
  allFeatures[(activeIndex.value + 1) % allFeatures.length],
  allFeatures[(activeIndex.value + 2) % allFeatures.length],
]);
const activeFeature = computed(() => [allFeatures[activeIndex.value]]);

// --- Autoplay ---
const startDesktopAutoplay = () => (desktopAutoplayInterval.value = setInterval(() => (activeIndex.value = (activeIndex.value + 1) % allFeatures.length), 5000));
const stopDesktopAutoplay = () => clearInterval(desktopAutoplayInterval.value);

// --- Refs for Animations ---
const headerRef = ref(null);
const contentRef = ref(null);
const largeCardRef = ref(null);
const smallCardsRef = ref(null);

// --- GSAP Animation Setup ---
onMounted(() => {
  startDesktopAutoplay();

  new Swiper(".swiper-container", {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    slidesPerView: 1,
    spaceBetween: 24,
  });

  // Header fade-in
  gsap.fromTo(
    headerRef.value,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: headerRef.value,
        start: "top 90%",
      },
    }
  );

  // Content fade-in
  gsap.fromTo(
    contentRef.value,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: contentRef.value,
        start: "top 85%",
      },
    }
  );

  // Individual card animations (desktop only)
  gsap.fromTo(
    [largeCardRef.value, smallCardsRef.value],
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: largeCardRef.value,
        start: "top 85%",
      },
    }
  );
});

onBeforeUnmount(() => stopDesktopAutoplay());
</script>

<style scoped>
.slide-transition-enter-active,
.slide-transition-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-transition-enter-from {
  transform: translateX(100%);
}
.slide-transition-leave-to {
  transform: translateX(-100%);
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease-in-out;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
