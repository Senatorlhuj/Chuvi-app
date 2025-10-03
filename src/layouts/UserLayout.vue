<template>
  <div class="flex flex-col min-h-screen" :style="{ fontFamily: 'var(--font-primary)' }">
    
    <!-- Header (Mobile toggle) -->
    <UserHeader 
      :is-sidebar-open="isSidebarOpen" 
      @toggleSidebar="isSidebarOpen = !isSidebarOpen"
    />

    <div class="flex flex-1 overflow-hidden">
      
      <!-- Desktop Sidebar (Fixed) -->
      <div 
        class="hidden md:flex flex-shrink-0 w-64 bg-white border-r fixed top-[var(--header-height,0px)] bottom-0 z-30"
      >
        <UserSidebar @closeSidebar="isSidebarOpen = false" />
      </div>

      <!-- Mobile Sidebar (overlay) -->
      <transition name="slide-fade">
        <div 
          v-if="isSidebarOpen" 
          @click="isSidebarOpen = false"
          class="fixed inset-0 bg-charcoal/50 z-40 md:hidden"
        >
          <div 
            @click.stop
            class="h-full absolute left-0 top-0 w-64 bg-white"
          >
            <UserSidebar @closeSidebar="isSidebarOpen = false" />
          </div>
        </div>
      </transition>

      <!-- Main Content Wrapper -->
      <div 
        class="flex flex-col flex-1 md:ml-64" 
        style="padding-bottom: var(--footer-height, 64px);" 
      >
        <!-- Scrollable main area -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="fixed bottom-0 left-0 right-0 z-20">
      <UserFooter />
    </div>

    <UseToast /> 
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// ⚠️ Corrected Imports based on our file structure (components/layout/...)
import UserHeader from '@/components/user/UserHeader.vue';
import UserSidebar from '@/components/user/UserSideBar.vue';
import UserFooter from '@/components/user/UserFooter.vue';

// Assuming UseToast is a component that displays toast messages
import UseToast from '@/components/Toast.vue'; 

const route = useRoute();
const isSidebarOpen = ref(false);

// Close the mobile sidebar when the route changes
watch(route, () => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false;
  }
});
</script>

<style scoped>
/* Custom transitions for mobile sidebar overlay */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
/* Ensure the sidebar slides in from the left on mobile */
.slide-fade-enter-active > div,
.slide-fade-leave-active > div {
    transition: transform 0.3s ease;
}
.slide-fade-enter-from > div {
    transform: translateX(-100%);
}
.slide-fade-leave-to > div {
    transform: translateX(-100%);
}
</style>
