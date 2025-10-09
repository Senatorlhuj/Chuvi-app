<template>
  <div class="flex h-screen overflow-hidden">
    <component :is="activeSidebarComponent" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <component :is="activeHeaderComponent" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
        <router-view />
      </main>

      <AdminFooter />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import EmployeeSidebar from "@/components/employee/EmployeeSidebar.vue";
import AdminFooter from "@/components/admin/AdminFooter.vue";
import AdminNavbar from "@/components/admin/AdminNavbar.vue";
import EmployeeNavbar from "@/components/employee/EmployeeNavbar.vue";

const isAdmin = () => !!localStorage.getItem("adminToken");
const activeSidebarComponent = computed(() => {
  return isAdmin() ? AdminSidebar : EmployeeSidebar;
});
const activeHeaderComponent = computed(() => {
  return isAdmin() ? AdminNavbar : EmployeeNavbar;
});
</script>