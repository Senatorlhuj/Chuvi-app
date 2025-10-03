<template>
  <router-link
    :to="to"
    class="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors duration-200"
    :class="{
      'bg-charcoal text-pure-gold': $route.name === to.name,
      'text-bone-white hover:bg-charcoal/50': $route.name !== to.name
    }"
  >
    <font-awesome-icon :icon="parsedIcon" class="text-xl w-5" /> 
    <span>{{ name }}</span>
  </router-link>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  to: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String, // Expects a string like "fa-solid fa-house"
    required: true
  }
});

// FIX: Create a computed property to parse the icon string
const parsedIcon = computed(() => {
    if (!props.icon) return [];
    return props.icon.split(' ');
});
</script>