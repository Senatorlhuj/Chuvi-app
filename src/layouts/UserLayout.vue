<template>
  <div 
    class="flex flex-col min-h-screen" 
    :style="{ fontFamily: 'var(--font-display, sans-serif)' }"
  >
    
    <UserHeader 
      :is-sidebar-open="isSidebarOpen" 
      @toggleSidebar="isSidebarOpen = !isSidebarOpen"
      @toggleCollapse="isSidebarCollapsed = !isSidebarCollapsed"
    />

    <div class="flex flex-1 overflow-hidden">

      <UserSidebar
        class="hidden md:flex fixed top-[var(--header-height,0px)] bottom-0 left-0 z-30 border-r border-golden-brown/20 transition-all duration-300 ease-in-out bg-charcoal"
        :is-collapsed="isSidebarCollapsed"
        @toggleCollapse="isSidebarCollapsed = !isSidebarCollapsed"
        @closeSidebar="isSidebarOpen = false"
      />

      <transition name="slide-fade">
        <div 
          v-if="isSidebarOpen" 
          @click="isSidebarOpen = false"
          class="fixed inset-0 bg-charcoal/50 z-40 md:hidden"
        >
          <div 
            @click.stop
            class="h-full absolute left-0 top-0 w-64 bg-charcoal" 
          >
            <UserSidebar @closeSidebar="isSidebarOpen = false" />
          </div>
        </div>
      </transition>

      <div
        class="flex flex-col flex-1 transition-all duration-300 ease-in-out overflow-y-auto"
        :class="[isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64']"
        style="padding-bottom: var(--footer-height, 64px);"
      >
        <main class="flex-1 p-4 md:p-8">
          <router-view />
        </main>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-20">
      <UserFooter />
    </div>

    <UseToast />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import UserHeader from '@/components/user/UserHeader.vue';
import UserSidebar from '@/components/user/UserSideBar.vue'; // Corrected capitalization from UserSidebar to UserSideBar to match import
import UserFooter from '@/components/user/UserFooter.vue';
import UseToast from '@/components/Toast.vue';

const route = useRoute();
const isSidebarOpen = ref(false);      // For mobile
const isSidebarCollapsed = ref(false); // For desktop

// Close mobile sidebar on route change
watch(route, () => {
  if (isSidebarOpen.value) isSidebarOpen.value = false;
});
</script>

<style scoped>
/* Mobile sidebar transition styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
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