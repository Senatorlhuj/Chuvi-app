<template>
  <!-- 
    Header is visible only on mobile (md:hidden) as the sidebar is always 
    visible on desktop, making the header redundant there.
  -->
  <header class="bg-navy-blue shadow-xl md:hidden sticky top-0 z-30">
    <div class="flex justify-between items-center px-4 py-3">
      <!-- Logo/Title -->
      <router-link :to="{ name: 'Home' }" class="text-bone-white text-xl font-bold tracking-wide" :style="{ fontFamily: 'var(--font-display)' }">
        Chuvi <span class="text-golden-brown">User</span>
      </router-link>
      
      <!-- Mobile Menu Toggle Button -->
      <button 
        @click="$emit('toggleSidebar')" 
        class="text-bone-white p-2 rounded-lg transition-colors duration-200 hover:bg-golden-brown/20"
        aria-label="Toggle navigation menu"
      >
        <!-- The icon (bars/times) is dynamically controlled by the parent layout -->
        <font-awesome-icon :icon="isSidebarOpen ? 'times' : 'bars'" class="w-6 h-6" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Props received from UserDashboardLayout
defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
});

// Define emit event for toggling the sidebar
defineEmits(['toggleSidebar']);

// NOTE: The logout button and links ('My Account', 'Logout') from your original header 
// template have been moved to the UserSidebar to keep navigation consolidated in one place.
</script>
