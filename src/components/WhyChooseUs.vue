<template>
  <section class="py-16 md:py-24 bg-bone-white overflow-hidden relative">
    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center mb-16">
        <h2
          class="text-3xl md:text-4xl font-black text-charcoal mb-4 tracking-tight"
        >
          Why Choose Chuvi
        </h2>
        <p class="text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto">
          We treat each item like it’s ours—sorted by fabric, washed with care, pressed to a crisp finish, and checked before it’s packed. You’ll get simple booking, clear timelines, and updates you can trust.
        </p>
      </div>

      <div class="lg:hidden">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              v-for="(feature, index) in allFeatures"
              :key="index"
              class="swiper-slide bg-bone-white rounded-2xl overflow-hidden flex flex-col border border-bone-white/50"
            >
              <div class="relative h-[200px] flex-shrink-0 rounded-2xl overflow-hidden">
                <img
                  :src="feature.image"
                  :alt="feature.title"
                  class="w-full h-full object-cover"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/10"
                ></div>
              </div>
              <div
                class="py-3 px-4 flex-grow flex flex-col justify-center text-center relative"
              >
                <div
                  class="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-golden-brown to-pure-gold rounded-lg flex items-center justify-center"
                  >
                    <div class="w-3 h-3 bg-bone-white rounded-sm opacity-90"></div>
                  </div>
                </div>
                <h3
                  class="text-xl font-bold text-charcoal leading-tight mt-2 mb-2"
                >
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

      <div class="hidden lg:flex lg:flex-row lg:space-x-8 relative">
        <div class="relative flex-shrink-0 lg:w-1/2 mb-10 lg:mb-0">
          <div
            class="bg-bone-white rounded-2xl overflow-hidden h-[500px] border border-bone-white/50"
          >
            <div class="relative h-3/5 rounded-2xl overflow-hidden">
              <transition-group
                tag="div"
                name="slide-transition"
                class="absolute inset-0"
              >
                <div
                  v-for="feature in activeFeature"
                  :key="feature.image"
                  class="absolute inset-0"
                >
                  <img
                    :src="feature.image"
                    :alt="feature.title"
                    class="w-full h-full object-cover"
                  />
                </div>
              </transition-group>
              <div
                class="absolute inset-0 bg-gradient-to-t from-navy-blue/20 to-transparent"
              ></div>
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
        <div class="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div
            v-for="(feature, index) in displayedFeatures.smallCards"
            :key="index"
            class="bg-bone-white rounded-2xl overflow-hidden h-[400px] flex flex-col border border-bone-white/50"
          >
            <div class="relative h-1/2 rounded-2xl overflow-hidden">
              <transition-group
                tag="div"
                name="slide-transition"
                class="absolute inset-0"
              >
                <div
                  class="absolute inset-0"
                  :key="smallCardImages[index].image"
                >
                  <img
                    :src="smallCardImages[index].image"
                    :alt="smallCardImages[index].title"
                    class="w-full h-full object-cover"
                  />
                </div>
              </transition-group>
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/10"
              ></div>
            </div>
            <div
              class="py-3 flex-grow flex flex-col justify-center text-center relative"
            >
              <div
                class="absolute -top-4 left-1/2 transform -translate-x-1/2"
              >
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// --- Feature Images ---
import solarImage from "@/assets/images/laundryImages/solar-powered.jpeg";
import tagImage from "@/assets/images/laundryImages/laundry-18.jpg";
import handSortingImage from "@/assets/images/laundryImages/hand-sorting.jpg";
import happyDeliveryImage from "@/assets/images/laundryImages/delivery-person.jpeg";

// --- Combined Feature Data ---
const allFeatures = [
  {
    image: happyDeliveryImage,
    title: "Our Promise to You",
    description: "No stories—we keep our word on pickup and delivery times.",
  },
  {
    image: tagImage,
    title: "Your clothes stay yours",
    description: "Every item is meticulously tagged and tracked throughout the process.",
  },
  {
    image: solarImage,
    title: "NEPA no be problem",
    description: "Solar backup keeps us running 24/7, ensuring your laundry is always on schedule.",
  },
  {
    image: handSortingImage,
    title: "Real people, real care",
    description: "Your clothes are not just machine washed; they are properly hand-sorted with care.",
  },
];

// --- Reactive State and Logic (Desktop) ---
const activeIndex = ref(0);
const desktopAutoplayInterval = ref(null);

const displayedFeatures = computed(() => {
  const largeIndex = activeIndex.value;
  const smallCard1Index = (largeIndex + 1) % allFeatures.length;
  const smallCard2Index = (largeIndex + 2) % allFeatures.length;

  return {
    largeCard: allFeatures[largeIndex],
    smallCards: [allFeatures[smallCard1Index], allFeatures[smallCard2Index]],
  };
});

const smallCardImages = computed(() => {
  const largeIndex = activeIndex.value;
  const smallCard1Index = (largeIndex + 1) % allFeatures.length;
  const smallCard2Index = (largeIndex + 2) % allFeatures.length;
  return [allFeatures[smallCard1Index], allFeatures[smallCard2Index]];
});
const activeFeature = computed(() => [allFeatures[activeIndex.value]]);

const startDesktopAutoplay = () => {
  desktopAutoplayInterval.value = setInterval(nextSlide, 5000);
};

const stopDesktopAutoplay = () => {
  clearInterval(desktopAutoplayInterval.value);
};

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % allFeatures.length;
};

// --- Lifecycle Hooks ---
onMounted(() => {
  startDesktopAutoplay();
  // Initialize Swiper on component mount
  new Swiper('.swiper-container', {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 24,
  });
});

onUnmounted(() => {
  stopDesktopAutoplay();
});
</script>

<style scoped>
/* Add Swiper-specific styles */
.swiper-container {
  overflow: hidden;
  width: 100%;
}
.swiper-wrapper {
  display: flex;
}
.swiper-slide {
  flex-shrink: 0;
  width: 85vw; /* Adjust to match previous behavior */
}

/* Fix for pagination dot styling */
:deep(.swiper-pagination-bullet) {
  background: var(--brand-gray);
}
:deep(.swiper-pagination-bullet-active) {
  background: var(--brand-orange);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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