<template>
  <div class="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200">
    <span class="text-charcoal">{{ name }}</span>
    <span class="font-semibold text-charcoal">{{ price }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});
</script>

