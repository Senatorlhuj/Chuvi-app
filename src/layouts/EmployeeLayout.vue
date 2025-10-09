<template>
  <div class="flex h-screen bg-gray-100 ">
    
    <EmployeeSidebar :is-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false" />

    <div class="flex-1 flex flex-col overflow-hidden">
      
      <EmployeeNavbar @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
        <router-view />
      </main>

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