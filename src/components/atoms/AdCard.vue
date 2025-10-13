<template>
  <div class="relative w-full h-80 md:h-120 rounded-xl overflow-hidden shadow-xl">
    <!-- Skeleton Loader -->
    <div
      v-show="!loaded"
      class="absolute inset-0 bg-gray-300 animate-pulse rounded-xl"
    ></div>

    <!-- Background Image -->
    <img
      :src="imageSrc"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      alt="background"
      @load="onLoad"
    />

    <!-- Overlay Gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>

    <!-- Content -->
    <div
      class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4"
    >
      <p
        class="text-xl md:text-4xl tracking-widest text-bone-white mb-4 font-bold transform transition-all duration-700 opacity-0 translate-y-10"
        :class="loaded ? 'opacity-100 translate-y-0' : ''"
      >
        <slot name="text"></slot>
      </p>

      <div
        class="mt-14 transform transition-all duration-700 opacity-0 translate-y-10"
        :class="loaded ? 'opacity-100 translate-y-0' : ''"
      >
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
});

const loaded = ref(false);

const onLoad = () => {
  loaded.value = true;
};
</script>
