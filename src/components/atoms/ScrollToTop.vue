<template>
  <transition name="fade">
    <button
      v-show="isVisible"
      @click="scrollToTop"
      aria-label="Scroll to top"
      class="fixed bottom-24 left-5 sm:bottom-8 sm:left-8 z-40 bg-golden-brown text-bone-white rounded-full cursor-pointer shadow-lg w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300"
    >
      <font-awesome-icon :icon="['fas', 'arrow-up']" class="text-xl" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowUp);

const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
