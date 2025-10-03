<template>
  <div class="relative w-full h-80 md:h-120 rounded-xl overflow-hidden shadow-xl">
    <img
      :src="imageSrc"
      class="absolute inset-0 w-full h-full object-cover"
      alt="background"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"
    ></div>
    <div
      class="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-4"
    >
      <p
        class="text-xl md:text-4xl tracking-widest text-bone-white mb-4 font-bold max-w-3xl"
      >
        <slot name="text"></slot>
      </p>

      <div class="mt-14">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
});
</script>