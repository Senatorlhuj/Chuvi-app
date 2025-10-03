<template>
  <section class="lg:h-screen lg:overflow-hidden relative py-16 bg-bone-white">
    <div class="lg:flex lg:h-full lg:min-h-screen container mx-auto">
      <div
        class="hidden lg:w-1/2 p-8 lg:p-12 lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:items-center lg:text-center"
      >
        <div class="space-y-6 transition-opacity duration-500">
          <img
            :src="tabs[activeTab].image"
            alt=""
            class="mx-auto max-w-sm object-cover rounded-full bg-navy-blue p-3"
          />
          <h2 class="text-3xl md:text-4xl font-extrabold text-charcoal">
            {{ tabs[activeTab].title }}
          </h2>
          <p class="text-charcoal text-lg max-w-md mx-auto">
            {{ tabs[activeTab].description }}
          </p>
          <div
            v-if="tabs[activeTab].buttons"
            class="flex flex-col space-y-4 pt-4"
          >
            <a
              href="#"
              class="bg-golden-brown text-bone-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Schedule pickup
            </a>
            <a
              href="#"
              class="bg-charcoal text-bone-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      <div class="lg:w-1/2 overflow-y-auto lg:pt-0 relative custom-scrollbar">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :data-index="index"
          ref="tabSections"
          class="p-4 sm:p-6 lg:p-16 flex flex-col justify-start lg:justify-center lg:min-h-screen-lg"
        >
          <div class="space-y-6 lg:space-y-12">
            <div class="lg:hidden text-center mb-6">
              <img
                :src="tab.image"
                alt=""
                class="mx-auto w-20 h-20 object-cover rounded-full bg-navy-blue p-3 mb-4"
              />
              <h2 class="text-2xl font-extrabold text-charcoal mb-2">
                {{ tab.title }}
              </h2>
              <p class="text-charcoal text-base max-w-md mx-auto">
                {{ tab.description }}
              </p>
            </div>

            <div v-if="index === 0">
              <img
                :src="tab.contentImage"
                alt="Wash and fold service"
                class="rounded-lg w-full h-48 sm:h-64 lg:h-auto object-cover mb-6 lg:mb-8"
              />

              <div class="lg:hidden">
                <div class="grid grid-cols-3 gap-2 text-center mb-6">
                  <div
                    v-for="(card, i) in tab.cards"
                    :key="i"
                    class="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200"
                    :class="{
                      'bg-golden-brown/20 border-2 border-golden-brown':
                        mobileSubTabActive === i,
                      'bg-white border-2 border-transparent':
                        mobileSubTabActive !== i,
                    }"
                    @click="mobileSubTabActive = i"
                  >
                    <font-awesome-icon
                      :icon="card.icon"
                      class="text-golden-brown text-xl mb-2"
                    />
                    <span
                      class="text-xs font-semibold text-center leading-tight"
                      >{{ card.title }}</span
                    >
                  </div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-md">
                  <h3 class="font-bold text-lg mb-2 text-charcoal">
                    {{ tab.cards[mobileSubTabActive].title }}
                  </h3>
                  <p class="text-charcoal/80 text-sm leading-relaxed">
                    {{ tab.cards[mobileSubTabActive].text }}
                  </p>
                </div>
              </div>

              <div class="hidden lg:block space-y-6">
                <div
                  v-for="(card, i) in tab.cards"
                  :key="i"
                  class="flex items-start space-x-4 bg-white p-6 rounded-lg"
                >
                  <font-awesome-icon
                    :icon="card.icon"
                    class="text-golden-brown text-2xl mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 class="font-bold text-lg mb-1 text-charcoal">
                      {{ card.title }}
                    </h3>
                    <p class="text-charcoal/80 text-sm">
                      {{ card.text }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="index === 1" class="space-y-4 lg:space-y-8">
              <div
                v-for="(card, i) in tab.cards"
                :key="i"
                class="bg-white p-4 lg:p-6 rounded-lg shadow-sm"
              >
                <h3 class="font-bold text-lg mb-2 text-charcoal">
                  {{ card.title }}
                </h3>
                <p class="text-charcoal/80 text-sm lg:text-base">
                  {{ card.text }}
                </p>
              </div>

              <div class="lg:hidden flex flex-col space-y-3 pt-4">
                <a
                  href="#"
                  class="bg-golden-brown text-bone-white py-3 px-6 rounded-full text-base font-semibold text-center hover:bg-opacity-90 transition-all duration-300"
                >
                  Schedule pickup
                </a>
                <a
                  href="#"
                  class="bg-charcoal text-bone-white py-3 px-6 rounded-full text-base font-semibold text-center hover:bg-opacity-90 transition-all duration-300"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div v-if="index === 2">
              <img
                :src="tab.contentImage"
                alt="Dry cleaning service"
                class="rounded-lg w-full h-48 sm:h-64 lg:h-auto object-cover mb-6 lg:mb-8"
              />

              <div class="lg:hidden">
                <div class="grid grid-cols-3 gap-2 text-center mb-6">
                  <div
                    v-for="(card, i) in tab.cards"
                    :key="i"
                    class="flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200"
                    :class="{
                      'bg-golden-brown/20 border-2 border-golden-brown':
                        mobileSubTabActive === i,
                      'bg-white border-2 border-transparent':
                        mobileSubTabActive !== i,
                    }"
                    @click="mobileSubTabActive = i"
                  >
                    <font-awesome-icon
                      :icon="card.icon"
                      class="text-golden-brown text-xl mb-2"
                    />
                    <span
                      class="text-xs font-semibold text-center leading-tight"
                      >{{ card.title }}</span
                    >
                  </div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-md">
                  <h3 class="font-bold text-lg mb-2 text-charcoal">
                    {{ tab.cards[mobileSubTabActive].title }}
                  </h3>
                  <p class="text-charcoal/80 text-sm leading-relaxed">
                    {{ tab.cards[mobileSubTabActive].text }}
                  </p>
                </div>
              </div>

              <div class="hidden lg:block space-y-6">
                <div
                  v-for="(card, i) in tab.cards"
                  :key="i"
                  class="flex items-start space-x-4 bg-white p-6 rounded-lg"
                >
                  <font-awesome-icon
                    :icon="card.icon"
                    class="text-golden-brown text-2xl mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 class="font-bold text-lg mb-1 text-charcoal">
                      {{ card.title }}
                    </h3>
                    <p class="text-charcoal/80 text-sm">
                      {{ card.text }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="index === 3">
              <div class="bg-white p-4 lg:p-6 rounded-lg shadow-md">
                <h3 class="font-bold text-lg mb-4 text-charcoal">
                  Dry Cleaning Standard 3-4 day turnaround for all orders.
                </h3>
                <div class="grid grid-cols-1  gap-4">
                  <div
                    v-for="(item, i) in tab.items"
                    :key="i"
                    class="flex justify-between items-center text-charcoal py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div class="flex items-center space-x-3">
                      <font-awesome-icon
                        :icon="item.icon"
                        class="text-golden-brown"
                      />
                      <span class="text-sm lg:text-base">{{ item.text }}</span>
                    </div>
                    <span class="font-semibold text-sm lg:text-base">{{
                      item.price
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="lg:hidden flex flex-col space-y-3 pt-6">
                <a
                  href="#"
                  class="w-auto bg-golden-brown text-bone-white py-3 px-6 rounded-full text-base font-semibold text-center hover:bg-opacity-90 transition-all duration-300"
                >
                  Schedule  pickup
                </a>
                <a
                  href="#"
                  class="bg-charcoal text-bone-white py-3 px-6 rounded-full text-base font-semibold text-center hover:bg-opacity-90 transition-all duration-300"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import {
  faCalendarDays,
  faHandsWash,
  faTshirt,
  faTag,
  faShirt,
  faUserTie,
  faHandsHolding,
} from "@fortawesome/free-solid-svg-icons";

// Images
import dryCleaningIcon from "@/assets/images/laundryImages/dry.png";
import washFoldIcon from "@/assets/images/laundryImages/wash.png";
import washFoldImage from "@/assets/images/laundryImages/laundry-24.jpeg";
import dryCleaningImage from "@/assets/images/laundryImages/laundry-26.JPG";

const tabs = [
  {
    title: "Wash & Fold",
    description:
      "The most effortless way to handle your everyday laundry needs.",
    image: washFoldIcon,
    contentImage: washFoldImage,
    cards: [
      {
        icon: faCalendarDays,
        title: "Schedule a pickup",
        text: "You can schedule a pickup any day of the week. Your Valet will arrive with your free, personalized Chuvi bags between 7pm and 10pm to pick up your clothes.",
      },
      {
        icon: faHandsWash,
        title: "Professional cleaning care",
        text: "Lights and darks are separated and washed in cold water. Hypoallergenic detergent and fabric softener are free upon request.",
      },
      {
        icon: faTshirt,
        title: "Ready to wear",
        text: "Your clothes are delivered to your door, crisply folded and your socks paired, ready to be worn or put into drawers.",
      },
    ],
  },
  {
    title: "Wash & Fold Pricing",
    description:
      "The most effortless way to handle your everyday laundry needs.",
    image: washFoldIcon,
    buttons: true,
    cards: [
      {
        title: "Pay-As-You-Go",
        text: "Our Wash & Fold service priced per pound. Standard 3-4 day turnaround. Next-Day Rush available.",
      },
      {
        title: "Chuvi Repeat",
        text: "Our all-inclusive Wash & Fold service, priced per bag, not per pound, with savings up to 52% compared with Pay-As-You-Go.",
      },
    ],
  },
  {
    title: "Dry Cleaning",
    description:
      "Convenient pickup and delivery to save you time. High-quality cleaning to keep you looking your best.",
    image: dryCleaningIcon,
    contentImage: dryCleaningImage,
    cards: [
      {
        icon: faTag,
        title: "Your clothes tracked",
        text: "We'll email you a photo and itemized inventory of everything being cleaned.",
      },
      {
        icon: faHandsHolding,
        title: "Expert cleaning and stain removal",
        text: "We carefully follow the care label and inspect your clothes for stains to ensure they receive the optimal treatment.",
      },
      {
        icon: faTshirt,
        title: "Pressed and returned on hangers",
        text: "Your clothes are delivered to your door crisply pressed, placed in protective garment bags, and ready to wear.",
      },
    ],
  },
  {
    title: "Dry Cleaning Pricing",
    description:
      "Convenient pickup and delivery to save you time. High-quality cleaning to keep you looking your best.",
    image: dryCleaningIcon,
    buttons: true,
    items: [
      { icon: faShirt, text: "Shirts", price: "$4.00" },
      { icon: faShirt, text: "Blouse", price: "$4.50" },
      { icon: faUserTie, text: "Pants", price: "$6.00" },
      { icon: faUserTie, text: "Sweater", price: "$7.00" },
      { icon: faUserTie, text: "Casual dress", price: "$15.00" },
    ],
  },
];

const activeTab = ref(0);
const mobileSubTabActive = ref(0);
const tabSections = ref([]);
const observer = ref(null);

watch(activeTab, () => {
  mobileSubTabActive.value = 0;
});

onMounted(async () => {
  await nextTick();
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeTab.value = Number(entry.target.dataset.index);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0,
    }
  );
  tabSections.value.forEach((section) => {
    if (section) observer.value.observe(section);
  });
});

onBeforeUnmount(() => {
  if (observer.value) observer.value.disconnect();
});
</script>

<style scoped>
/* Mobile-first approach with proper spacing */
.min-h-screen-lg {
  min-height: 100vh;
}

/* Base styles for the fixed container on large screens */
@media (min-width: 1024px) {
  .lg\:h-screen {
    height: 100vh;
  }

  /* min-h-screen is only applied on large screens */
  .lg\:min-h-screen-lg {
    min-height: 100vh;
  }
}

/* Improve text readability on mobile */
@media (max-width: 640px) {
  .text-xs {
    font-size: 0.7rem;
    line-height: 1rem;
  }
}
.custom-scrollbar::-webkit-scrollbar {
   display: none;
}
</style>
