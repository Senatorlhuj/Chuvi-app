<template>
  <section
    id="how-it-works"
    class="relative py-24 bg-bone-white overflow-hidden"
  >
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden opacity-5">
      <div
        class="absolute top-0 left-0 w-72 h-72 bg-pure-gold rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-golden-brown rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative z-10 container mx-auto px-6 text-center max-w-6xl space-y-20"
    >
      <!-- Header -->
      <div
        id="hiw-header"
        data-animate
        :class="isVisible['hiw-header'] ? 'visible' : ''"
        class="mb-16"
      >
        <h2
          class="text-4xl md:text-5xl font-extrabold text-charcoal mb-4 tracking-tight"
        >
          How It Works
        </h2>
        <p
          class="text-lg md:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
        >
          Get your laundry and dry cleaning done in a snap!
        </p>
      </div>

      <!-- Steps -->
      <div
        id="hiw-steps"
        data-animate
        :class="isVisible['hiw-steps'] ? 'visible' : ''"
        class="flex flex-col md:flex-row items-stretch justify-center space-y-10 md:space-y-0 md:space-x-12 lg:space-x-16"
      >
        <!-- Step 1 -->
        <div
          class="flex flex-col items-center justify-between w-full md:w-1/3 p-6 bg-white rounded-2xl border border-charcoal/10 text-center"
        >
          <div
            class="w-24 h-24 mb-4 flex items-center justify-center bg-golden-brown/10 rounded-full"
          >
            <img
              src="@/assets/images/laundryImages/book.png"
              alt="Book Icon"
              class="max-h-full max-w-full object-contain"
            />
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">
            Book Your Service
          </h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            Book on WhatsApp (or fill the form) with your address/landmark and
            preferred time.
          </p>
        </div>

        <!-- Arrow -->
        <div class="hidden md:block text-pure-gold animate-arrow self-center">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>
        <div class="md:hidden text-pure-gold animate-arrow-vertical">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <!-- Step 2 -->
        <div
          class="flex flex-col items-center justify-between w-full md:w-1/3 p-6 bg-white rounded-2xl border border-charcoal/10 text-center"
        >
          <div
            class="w-24 h-24 mb-4 flex items-center justify-center bg-golden-brown/10 rounded-full"
          >
            <img
              src="@/assets/images/laundryImages/process-order.png"
              alt="Processing Order Icon"
              class="max-h-full max-w-full object-contain"
            />
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Processing Order</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            We tag and process your order, then send a ready-notice.
          </p>
        </div>

        <!-- Arrow -->
        <div class="hidden md:block text-pure-gold animate-arrow self-center">
          <font-awesome-icon icon="arrow-right" class="text-4xl" />
        </div>
        <div class="md:hidden text-pure-gold animate-arrow-vertical">
          <font-awesome-icon icon="arrow-down" class="text-4xl" />
        </div>

        <!-- Step 3 -->
        <div
          class="flex flex-col items-center justify-between w-full md:w-1/3 p-6 bg-white rounded-2xl border border-charcoal/10 text-center"
        >
          <div
            class="w-24 h-24 mb-4 flex items-center justify-center bg-golden-brown/10 rounded-full"
          >
            <img
              src="@/assets/images/laundryImages/delivery.png"
              alt="Delivery Icon"
              class="max-h-full max-w-full object-contain"
            />
          </div>
          <h3 class="text-xl font-bold text-charcoal mb-2">Fast Delivery</h3>
          <p class="text-charcoal/70 text-sm md:text-base leading-relaxed">
            We deliver and you confirm your items. Pay by transfer, POS, or
            cash.
          </p>
        </div>
      </div>

      <!-- CTA Button -->
      <div
        id="hiw-cta"
        data-animate
        :class="isVisible['hiw-cta'] ? 'visible' : ''"
        class="mt-16"
      >
        <BaseButton
          class="bg-golden-brown text-white py-3 px-10 text-lg font-semibold rounded-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105  cursor-pointer"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { faArrowRight, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faArrowRight, faArrowDown);
import BaseButton from "@/components/atoms/BaseButton.vue";

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

  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));

  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
/* Reusable scroll fade-up animation (same as About section) */
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}

/* Arrows pulse animation */
@keyframes pulseArrow {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.8;
  }
  50% {
    transform: translateX(6px);
    opacity: 1;
  }
}

@keyframes pulseArrowVertical {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

.animate-arrow {
  animation: pulseArrow 1.5s ease-in-out infinite;
}
.animate-arrow-vertical {
  animation: pulseArrowVertical 1.5s ease-in-out infinite;
}
</style>
