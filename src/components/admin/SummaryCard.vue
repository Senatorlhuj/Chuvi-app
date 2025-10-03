<template>
  <div :class="['p-5 rounded-xl shadow-md text-bone-white', color]">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium opacity-80">{{ title }}</p>
      
      <font-awesome-icon :icon="parsedIcon" class="text-2xl" /> 
      
    </div>
    <p class="text-3xl font-bold mt-2">{{ value }}</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String, 
  color: String
});


const parsedIcon = computed(() => {
    if (!props.icon) return [];
   
    return props.icon.split(' ');
});
</script>