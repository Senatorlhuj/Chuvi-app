<template>
  <router-link
    :to="to"
    class="relative group flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out"
    :class="{
      'bg-golden-brown/30 text-pure-gold': $route.name === to.name,
      'text-bone-white/70 hover:text-pure-gold hover:bg-golden-brown/20': $route.name !== to.name
    }"
  >
    <!-- Icon -->
    <font-awesome-icon 
      :icon="parsedIcon" 
      :class="['flex-shrink-0', collapsed ? 'text-lg' : 'text-base']"
    />

    <!-- Text (Hidden when collapsed) -->
    <span 
      v-if="!collapsed"
      class="text-sm truncate whitespace-nowrap"
    >
      {{ name }}
    </span>

    <!-- Tooltip (Show on hover when collapsed) -->
    <div
      v-if="collapsed"
      class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-golden-brown text-navy-blue text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg"
    >
      {{ name }}
    </div>
  </router-link>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
  },
  collapsed: {
    type: Boolean,
    default: false
  }
});

// Parse the icon string to array for FontAwesome
const parsedIcon = computed(() => {
  if (!props.icon) return [];
  return props.icon.split(' ');
});
</script>

<style scoped>
a {
  text-decoration: none;
}

a.router-link-active {
  background-color: bg-golden-brown/30;
  color:text-pure-gold ;

}
</style>