<template>
  <div class="flex h-screen bg-gradient-to-br from-bone-white via-cream/30 to-bone-white overflow-hidden">
    <!-- Sidebar - Stretches full height -->
    <UserSidebar
      :is-open="isSidebarOpen"
      @close-sidebar="isSidebarOpen = false"
    />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1">
      <!-- Header - Fixed at Top -->
      <header class="flex-shrink-0 border-b border-golden-brown/20 bg-bone-white shadow-sm z-30">
        <UserHeader 
          :is-sidebar-open="isSidebarOpen" 
          @toggleSidebar="isSidebarOpen = !isSidebarOpen"
        />
      </header>

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto min-h-0">
        <div class="p-4 md:p-6 lg:p-8 min-h-full flex flex-col">
          <!-- Content Wrapper with Max Width -->
          <div class="max-w-7xl mx-auto w-full flex-1">
            <router-view />
          </div>
        </div>
      </main>

      <!-- Footer - Fixed at Bottom -->
      <footer class="flex-shrink-0 border-t border-golden-brown/20 bg-bone-white shadow-sm">
        <UserFooter />
      </footer>
    </div>

    <!-- Toast Notifications -->
    <UseToast />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import UserHeader from '@/components/user/UserHeader.vue';
import UserSidebar from '@/components/user/UserSideBar.vue';
import UserFooter from '@/components/user/UserFooter.vue';
import UseToast from '@/components/Toast.vue';

const route = useRoute();
const isSidebarOpen = ref(false);

// Close mobile sidebar on route change
watch(route, () => {
  if (isSidebarOpen.value) isSidebarOpen.value = false;
});
</script>

<style scoped>
/* Smooth transitions for all elements */
* {
  @apply transition-all duration-300;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(229, 184, 11, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(229, 184, 11, 0.5);
}
</style>