<template>
  <section
    class="offer-banner py-16 md:py-24 bg-cream relative overflow-hidden"
  >
    <div
      ref="contentRef"
      class="container mx-auto px-4 flex flex-col items-center text-center relative z-10 opacity-0"
    >
      <p
        class="text-md md:text-xl uppercase tracking-widest text-charcoal mb-4 font-bold"
      >
        Schedule Today To
      </p>
      <h2
        class="text-3xl md:text-4xl lg:text-6xl font-black text-charcoal leading-tight mb-2"
      >
        Get <span class="text-golden-brown">₦500 off</span>
      </h2>
      <h2
        class="text-3xl md:text-4xl lg:text-6xl font-black text-golden-brown leading-tight mb-12"
      >
        your first-time order
      </h2>

      <base-button
        class="bg-golden-brown offer-button py-4 px-6 rounded-md font-bold text-cream text-lg shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
      >
        Ready to try us? Book a Pickup
      </base-button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BaseButton from "@/components/atoms/BaseButton.vue";

gsap.registerPlugin(ScrollTrigger);

const contentRef = ref(null);

onMounted(() => {
  // Fade-up animation on scroll
  gsap.fromTo(
    contentRef.value,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: contentRef.value,
        start: "top 85%",
      },
    }
  );
});
</script>

<style scoped>
.offer-banner {
  position: relative;
  background: linear-gradient(to bottom right, #fffaf0, #fff8e7);
}

.offer-button {
  box-shadow: 0 10px 25px rgba(182, 134, 44, 0.4);
}
</style>
