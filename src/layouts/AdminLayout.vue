<template>
  <div class="flex h-screen bg-white overflow-hidden">
    <!-- Sidebars (Desktop lg+, Tablet md-lg, Mobile modal) -->
    <AdminSidebar :is-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1">
      <!-- Header/Navbar -->
      <AdminNavbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Main Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-navy-blue/5 via-transparent to-golden-brown/5 custom-scrollbar">
        <div class="p-4 md:p-6 lg:p-8">
          <router-view />
        </div>
      </main>

      <!-- Footer -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminFooter from '@/components/admin/AdminFooter.vue';

const isSidebarOpen = ref(false);
</script>

<style scoped>
/* Smooth transitions for sidebar */
* {
  @apply transition-all duration-300;
}
:deep(.custom-scrollbar)::-webkit-scrollbar {
  width: 8px; /* Set the width of the scrollbar */
}
:deep(.custom-scrollbar)::-webkit-scrollbar-track {
  /* Slightly lighter charcoal/dark gray for the track */
  background: #3c3a39; 
  border-radius: 4px;
}
:deep(.custom-scrollbar)::-webkit-scrollbar-thumb {
  /* --color-golden-brown */
  background-color: #996515; 
  border-radius: 4px;
}
:deep(.custom-scrollbar)::-webkit-scrollbar-thumb:hover {
  /* A slightly brighter color on hover */
  background-color: #e5b80b; /* Using --color-pure-gold for hover effect */
}

/* Firefox (For compatibility) */
:deep(.custom-scrollbar) {
  scrollbar-width: thin; /* 'auto' or 'thin' */
  /* thumb color track color */
  scrollbar-color: #996515 #3c3a39;
}
</style>