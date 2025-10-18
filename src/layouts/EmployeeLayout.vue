<template>
  <div class="flex h-screen bg-gradient-to-br from-bone-white via-cream/30 to-bone-white overflow-hidden">
    <!-- Sidebar -->
    <EmployeeSidebar :is-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Header/Navbar -->
      <EmployeeNavbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <!-- Main Content with Gradient Background -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="p-4 md:p-6 lg:p-8 min-h-full">
          <!-- Content Wrapper -->
          <div class="max-w-7xl mx-auto">
            <router-view />
          </div>
        </div>
      </main>

      <!-- Footer -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EmployeeNavbar from '@/components/employee/EmployeeNavbar.vue';
import EmployeeSidebar from '@/components/employee/EmployeeSidebar.vue';
import AdminFooter from '@/components/admin/AdminFooter.vue';

const isSidebarOpen = ref(false);
</script>

<style scoped>
/* Smooth transitions */
* {
  @apply transition-all duration-300;
}
</style>