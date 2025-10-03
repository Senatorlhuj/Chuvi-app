<template>
  <a
    href="/register"
    :class="computedClasses"
    class="font-semibold transition-all duration-300 text-center"
  >
    Book pickup
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'golden-brown',
  },
  textColor: {
    type: String,
    default: 'bone-white',
  },
  borderRadius: {
    type: String,
    default: 'rounded-full',
  },
  hoverColor: {
    type: String,
    default: 'pure-gold',
  },
  padding: {
    type: String,
    default: 'py-2 px-5',
  },
});

const computedClasses = computed(() => {
  return [
    `bg-${props.backgroundColor}`,
    `text-${props.textColor}`,
    props.borderRadius,
    props.padding,
    `hover:bg-${props.hoverColor}`,
  ];
});
</script>