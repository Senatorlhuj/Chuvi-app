<template>
  <div class="bg-white rounded-lg not-even:overflow-hidden border border-gray-200">
    <div class="relative h-32">
      <img :src="image" alt="Category background" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
      <h3 class="absolute bottom-4 left-4 text-2xl font-bold text-white z-10">
        {{ title }}
      </h3>
    </div>

    <div class="p-4">
      <slot name="items"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
</script>

