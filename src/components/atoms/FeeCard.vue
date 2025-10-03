<template>
  <div class="p-6 bg-white border border-gray-200 rounded-lg ">
    <h3 class="text-3xl font-light text-gray-400 mb-2">{{ price }}</h3>
    <h4 class="text-lg font-bold text-charcoal mb-4">
      <slot name="title"></slot>
    </h4>
    <p class="text-sm text-gray-600 leading-relaxed mb-4">
      <slot name="description"></slot>
    </p>
    <div
      v-if="offer"
      class="bg-bone-white text-golden-brown py-1.5 px-3 text-xs rounded-full font-semibold w-fit"
    >
      {{ offer }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  price: {
    type: String,
    required: true,
  },
  offer: {
    type: String,
    default: '',
  },
});
</script>